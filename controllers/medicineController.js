const Medicine = require('../models/Medicine');
const Batch = require('../models/Batch');

const medicineController = {
  // Get all medicines with stock information
  async getAllMedicines(req, res) {
    try {
      const medicines = await Medicine.findAll();
      res.json({
        success: true,
        count: medicines.length,
        data: medicines
      });
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch medicines'
      });
    }
  },

  // Get medicine by ID
  async getMedicineById(req, res) {
    try {
      const { id } = req.params;
      const medicine = await Medicine.findById(id);
      
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }

      // Get batches for this medicine
      const batches = await Batch.findByMedicineId(id);
      
      res.json({
        success: true,
        data: {
          ...medicine,
          batches
        }
      });
    } catch (error) {
      console.error('Error fetching medicine:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch medicine'
      });
    }
  },

  // Search medicine by barcode
  async getMedicineByBarcode(req, res) {
    try {
      const { barcode } = req.params;
      const medicine = await Medicine.findByBarcode(barcode);
      
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found with this barcode'
        });
      }

      // Get batches for this medicine
      const batches = await Batch.findByMedicineId(medicine.id);
      
      res.json({
        success: true,
        data: {
          ...medicine,
          batches
        }
      });
    } catch (error) {
      console.error('Error searching by barcode:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search medicine by barcode'
      });
    }
  },

  // Create new medicine
  async createMedicine(req, res) {
    try {
      const { name, barcode, description, category, manufacturer } = req.body;
      
      // Check if barcode already exists
      const existingMedicine = await Medicine.findByBarcode(barcode);
      if (existingMedicine) {
        return res.status(400).json({
          success: false,
          error: 'Medicine with this barcode already exists'
        });
      }

      const medicine = await Medicine.create({
        name,
        barcode,
        description,
        category,
        manufacturer
      });

      res.status(201).json({
        success: true,
        message: 'Medicine created successfully',
        data: medicine
      });
    } catch (error) {
      console.error('Error creating medicine:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create medicine'
      });
    }
  },

  // Update medicine
  async updateMedicine(req, res) {
    try {
      const { id } = req.params;
      const { name, description, category, manufacturer } = req.body;

      const medicine = await Medicine.update(id, {
        name,
        description,
        category,
        manufacturer
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }

      res.json({
        success: true,
        message: 'Medicine updated successfully',
        data: medicine
      });
    } catch (error) {
      console.error('Error updating medicine:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update medicine'
      });
    }
  },

  // Add new batch to medicine
  async addBatch(req, res) {
    try {
      const { id } = req.params;
      const { batch_number, quantity, expiry_date, cost_price, selling_price } = req.body;

      // Check if medicine exists
      const medicine = await Medicine.findById(id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }

      const batch = await Batch.create({
        medicine_id: id,
        batch_number,
        quantity,
        expiry_date,
        cost_price,
        selling_price
      });

      res.status(201).json({
        success: true,
        message: 'Batch added successfully',
        data: batch
      });
    } catch (error) {
      console.error('Error adding batch:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add batch'
      });
    }
  },

  // Get stock alerts
  async getStockAlerts(req, res) {
    try {
      const alerts = await Medicine.getStockAlerts();
      const expiringBatches = await Batch.getExpiringBatches(30);

      res.json({
        success: true,
        data: {
          stock_alerts: alerts.filter(alert => alert.alert_type === 'low_stock'),
          expiry_alerts: alerts.filter(alert => alert.alert_type === 'expiring_soon'),
          expiring_batches: expiringBatches,
          summary: {
            low_stock_count: alerts.filter(alert => alert.alert_type === 'low_stock').length,
            expiring_soon_count: alerts.filter(alert => alert.alert_type === 'expiring_soon').length,
            total_alerts: alerts.length
          }
        }
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stock alerts'
      });
    }
  },

  // Delete medicine
  async deleteMedicine(req, res) {
    try {
      const { id } = req.params;
      const medicine = await Medicine.delete(id);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }

      res.json({
        success: true,
        message: 'Medicine deleted successfully',
        data: medicine
      });
    } catch (error) {
      console.error('Error deleting medicine:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete medicine'
      });
    }
  }
};

module.exports = medicineController;