const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'pharmacyuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pharmacydb',
  password: process.env.DB_PASSWORD || 'md0341',
  port: process.env.DB_PORT || 3000,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = {
  connectDB,
  query,
  pool
};