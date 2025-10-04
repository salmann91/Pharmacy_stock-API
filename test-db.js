require('dotenv').config();
const { connectDB, query } = require('./config/database');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    
    // Test if tables exist
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('✅ Database connected successfully!');
    console.log('📋 Tables found:', result.rows.map(row => row.table_name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Create database: createdb pharmacydb');
    console.log('3. Run schema: psql -d pharmacydb -f database/schema.sql');
    console.log('4. Check your .env file settings');
    process.exit(1);
  }
}

testDatabase();