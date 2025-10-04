const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController'); // Fixed: removed 's' from Controllers
const { validateMedicine, validateBatch } = require('../middleware/validation');

// Get all medicines with stock information
router.get('/', medicineController.getAllMedicines);

// Get stock alerts (low stock and expiring medicines) - MUST be before /:id
router.get('/alerts', medicineController.getStockAlerts);

// Search medicine by barcode
router.get('/barcode/:barcode', medicineController.getMedicineByBarcode);

// Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Create new medicine
router.post('/', validateMedicine, medicineController.createMedicine);

// Update medicine
router.put('/:id', validateMedicine, medicineController.updateMedicine);

// Delete medicine
router.delete('/:id', medicineController.deleteMedicine);
// Add batch to medicine
router.post('/:id/batches', validateBatch, medicineController.addBatch);

module.exports = router;