const Joi = require('joi');

const medicineSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  barcode: Joi.string().min(8).max(50).required(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().min(2).max(50).required(),
  manufacturer: Joi.string().min(2).max(100).optional()
});

const batchSchema = Joi.object({
  batch_number: Joi.string().min(1).max(50).required(),
  quantity: Joi.number().integer().min(0).required(),
  expiry_date: Joi.date().greater('now').required(),
  cost_price: Joi.number().precision(2).min(0).optional(),
  selling_price: Joi.number().precision(2).min(0).optional()
});

const validateMedicine = (req, res, next) => {
  const { error } = medicineSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateBatch = (req, res, next) => {
  const { error } = batchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateMedicine,
  validateBatch
};