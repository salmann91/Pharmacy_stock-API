# Setup Guide for Pharmacy Stock API

## Prerequisites
1. **Install PostgreSQL** (if not installed):
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember the password for 'postgres' user

## Database Setup

### Step 1: Start PostgreSQL Service
```bash
# Check if PostgreSQL is running
net start postgresql-x64-14  # or your version

# If not running, start it
net start postgresql-x64-14
```

### Step 2: Create Database
```bash
# Open Command Prompt as Administrator
# Navigate to PostgreSQL bin directory (usually):
cd "C:\Program Files\PostgreSQL\14\bin"

# Create database
createdb -U postgres pharmacydb
```

### Step 3: Run Database Schema
```bash
# Still in PostgreSQL bin directory
psql -U postgres -d pharmacydb -f "d:\Pharmacy_stock API\database\schema.sql"
```

### Step 4: Update .env file
Update your `.env` file with correct PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacydb
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

## Quick Start (Alternative - SQLite for testing)
If PostgreSQL setup is complex, I can modify the project to use SQLite for quick testing.

## Test Connection
```bash
npm run test-db
```

## Start Server
```bash
npm run dev
```

The API will be available at: http://localhost:3000