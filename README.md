# Pharmacy Stock API

A comprehensive REST API for managing pharmacy medicine stocks with barcode scanning, stock alerts, and batch expiry tracking.

## Features

- 📊 **Stock Management**: Track medicine inventory with real-time stock levels
- 🔍 **Barcode Scanning**: Search and manage medicines using barcode
- ⚠️ **Stock Alerts**: Automatic alerts for low stock and expiring medicines
- 📅 **Batch Expiry**: Track expiry dates and get warnings for soon-to-expire items
- 🏥 **Medicine Management**: Complete CRUD operations for medicines and batches

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Validation**: Joi
- **Security**: Helmet, CORS

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-stock-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb pharmacy_stock
   
   # Run schema
   psql -d pharmacy_stock -f database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be running at `http://localhost:3000`

## API Endpoints

### Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines with stock info |
| GET | `/api/medicines/:id` | Get medicine by ID |
| GET | `/api/medicines/barcode/:barcode` | Search medicine by barcode |
| POST | `/api/medicines` | Create new medicine |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |

### Batches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medicines/:id/batches` | Add new batch to medicine |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines/alerts` | Get stock alerts and expiry warnings |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |

## Request Examples

### Create Medicine
```bash
curl -X POST http://localhost:3000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol 500mg",
    "barcode": "1234567890123",
    "description": "Pain reliever and fever reducer",
    "category": "Analgesic",
    "manufacturer": "PharmaCorp"
  }'
```

### Add Batch
```bash
curl -X POST http://localhost:3000/api/medicines/{medicine_id}/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batch_number": "BATCH001",
    "quantity": 100,
    "expiry_date": "2025-12-31",
    "cost_price": 5.00,
    "selling_price": 8.50
  }'
```

### Search by Barcode
```bash
curl http://localhost:3000/api/medicines/barcode/1234567890123
```

### Get Stock Alerts
```bash
curl http://localhost:3000/api/medicines/alerts
```

## Database Schema

### Tables

- **medicines**: Store medicine information
- **batches**: Store batch information with expiry dates
- **stock_movements**: Track stock changes (for future use)

### Key Features

- UUID primary keys for better security
- Automatic timestamps with triggers
- Indexes for optimal query performance
- Row Level Security ready
- Sample data included

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Stock Alerts

The system provides two types of alerts:

1. **Low Stock Alerts**: Medicines with less than 10 units
2. **Expiry Alerts**: Medicines expiring within 30 days

## Development

### Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

### Project Structure

```
pharmacy-stock-api/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   └── medicineController.js # Business logic
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   └── validation.js        # Input validation
├── models/
│   ├── Medicine.js          # Medicine model
│   └── Batch.js            # Batch model
├── routes/
│   └── medicines.js        # API routes
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── server.js             # Main server file
└── todo.md               # Development checklist
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.