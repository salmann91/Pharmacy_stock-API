const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockMedicines = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    barcode: '1234567890123',
    description: 'Pain reliever and fever reducer',
    category: 'Analgesic',
    manufacturer: 'PharmaCorp',
    total_stock: 100
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    barcode: '2345678901234',
    description: 'Antibiotic for bacterial infections',
    category: 'Antibiotic',
    manufacturer: 'MediLab',
    total_stock: 50
  }
];

// Routes
app.get('/api/medicines', (req, res) => {
  res.json({
    success: true,
    count: mockMedicines.length,
    data: mockMedicines
  });
});

app.get('/api/medicines/alerts', (req, res) => {
  res.json({
    success: true,
    data: {
      stock_alerts: [],
      expiry_alerts: [],
      summary: {
        low_stock_count: 0,
        expiring_soon_count: 0,
        total_alerts: 0
      }
    }
  });
});

app.get('/api/medicines/barcode/:barcode', (req, res) => {
  const medicine = mockMedicines.find(m => m.barcode === req.params.barcode);
  if (!medicine) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found with this barcode'
    });
  }
  res.json({
    success: true,
    data: medicine
  });
});

app.get('/api/medicines/:id', (req, res) => {
  const medicine = mockMedicines.find(m => m.id === req.params.id);
  if (!medicine) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found'
    });
  }
  res.json({
    success: true,
    data: medicine
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Pharmacy Stock API is running (No Database Mode)',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pharmacy Stock API',
    version: '1.0.0',
    mode: 'No Database - Mock Data',
    endpoints: {
      health: '/health',
      medicines: '/api/medicines',
      barcode: '/api/medicines/barcode/:barcode',
      alerts: '/api/medicines/alerts'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pharmacy Stock API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API docs: http://localhost:${PORT}/`);
  console.log(`⚠️  Running in NO DATABASE mode with mock data`);
});

module.exports = app;