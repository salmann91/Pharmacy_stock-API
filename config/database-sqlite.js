const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'pharmacy.db');
const db = new sqlite3.Database(dbPath);

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create medicines table
      db.run(`CREATE TABLE IF NOT EXISTS medicines (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        description TEXT,
        category TEXT,
        manufacturer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create batches table
      db.run(`CREATE TABLE IF NOT EXISTS batches (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        medicine_id TEXT NOT NULL,
        batch_number TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        expiry_date DATE,
        cost_price DECIMAL(10,2),
        selling_price DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('❌ Database setup failed:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          resolve();
        }
      });
    });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ rowCount: this.changes, insertId: this.lastID });
      });
    }
  });
};

module.exports = { connectDB, query, db };