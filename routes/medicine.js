const express = require('express');
const router = express.Router();
const medicineController = require('../controller/medicineController');
const { validateMedicine, validateBatch } = require('../middleware/validation');

// Get all medicines
router.get('/', medicineController.getAllMedicines);

// Get stock alerts
router.get('/alerts', medicineController.getStockAlerts);

// Search medicine by barcode
router.get('/barcode/:barcode', medicineController.getMedicineByBarcode);

// Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Create new medicine
router.post('/', validateMedicine, medicineController.createMedicine);

// Update medicine
router.put('/:id', validateMedicine, medicineController.updateMedicine);

// Add batch to medicine
router.post('/:id/batches', validateBatch, medicineController.addBatch);

// Delete medicine
router.delete('/:id', medicineController.deleteMedicine);

module.exports = router;