-- Pharmacy Stock Management Database Schema

-- Create database (run this separately)
-- CREATE DATABASE pharmacy_stock;

-- Connect to the database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medicine_id, batch_number)
);

-- Stock movements table (for tracking stock changes)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT', 'EXPIRED')),
    quantity INTEGER NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_barcode ON medicines(barcode);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);

CREATE INDEX IF NOT EXISTS idx_batches_medicine_id ON batches(medicine_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_batches_quantity ON batches(quantity);

CREATE INDEX IF NOT EXISTS idx_stock_movements_batch_id ON stock_movements(batch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_medicines_updated_at 
    BEFORE UPDATE ON medicines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at 
    BEFORE UPDATE ON batches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO medicines (name, barcode, description, category, manufacturer) VALUES
('Paracetamol 500mg', '1234567890123', 'Pain reliever and fever reducer', 'Analgesic', 'PharmaCorp'),
('Amoxicillin 250mg', '2345678901234', 'Antibiotic for bacterial infections', 'Antibiotic', 'MediLab'),
('Ibuprofen 400mg', '3456789012345', 'Anti-inflammatory pain reliever', 'NSAID', 'HealthPlus'),
('Vitamin C 1000mg', '4567890123456', 'Immune system support', 'Vitamin', 'NutriCare'),
('Aspirin 75mg', '5678901234567', 'Blood thinner and pain reliever', 'Analgesic', 'CardioMed')
ON CONFLICT (barcode) DO NOTHING;

-- Insert sample batches
INSERT INTO batches (medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price)
SELECT 
    m.id,
    'BATCH001',
    100,
    CURRENT_DATE + INTERVAL '1 year',
    5.00,
    8.50
FROM medicines m WHERE m.barcode = '1234567890123'
ON CONFLICT (medicine_id, batch_number) DO NOTHING;

INSERT INTO batches (medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price)
SELECT 
    m.id,
    'BATCH002',
    50,
    CURRENT_DATE + INTERVAL '6 months',
    12.00,
    18.00
FROM medicines m WHERE m.barcode = '2345678901234'
ON CONFLICT (medicine_id, batch_number) DO NOTHING;

INSERT INTO batches (medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price)
SELECT 
    m.id,
    'BATCH003',
    5,
    CURRENT_DATE + INTERVAL '2 months',
    8.00,
    12.50
FROM medicines m WHERE m.barcode = '3456789012345'
ON CONFLICT (medicine_id, batch_number) DO NOTHING;

-- Create a view for low stock alerts
CREATE OR REPLACE VIEW low_stock_medicines AS
SELECT 
    m.id,
    m.name,
    m.barcode,
    m.category,
    COALESCE(SUM(b.quantity), 0) as total_stock
FROM medicines m
LEFT JOIN batches b ON m.id = b.medicine_id
GROUP BY m.id, m.name, m.barcode, m.category
HAVING COALESCE(SUM(b.quantity), 0) < 10;

-- Create a view for expiring medicines
CREATE OR REPLACE VIEW expiring_medicines AS
SELECT 
    m.name,
    m.barcode,
    m.category,
    b.batch_number,
    b.quantity,
    b.expiry_date,
    (b.expiry_date - CURRENT_DATE) as days_to_expiry
FROM medicines m
JOIN batches b ON m.id = b.medicine_id
WHERE b.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    AND b.expiry_date > CURRENT_DATE
    AND b.quantity > 0
ORDER BY b.expiry_date ASC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;