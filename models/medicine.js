const { query } = require('../config/database-sqlite');

class Medicine {
  static async create(medicineData) {
    const { name, barcode, description, category, manufacturer } = medicineData;
    const sql = `
      INSERT INTO medicines (name, barcode, description, category, manufacturer)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [name, barcode, description, category, manufacturer]);
    return result.rows[0];
  }

  static async findAll() {
    const sql = `
      SELECT 
        m.*,
        COALESCE(SUM(b.quantity), 0) as total_stock,
        COUNT(b.id) as batch_count,
        MIN(b.expiry_date) as nearest_expiry
      FROM medicines m
      LEFT JOIN batches b ON m.id = b.medicine_id
      GROUP BY m.id
      ORDER BY m.name
    `;
    const result = await query(sql);
    return result.rows;
  }

  static async findById(id) {
    const sql = `
      SELECT 
        m.*,
        COALESCE(SUM(b.quantity), 0) as total_stock,
        COUNT(b.id) as batch_count
      FROM medicines m
      LEFT JOIN batches b ON m.id = b.medicine_id
      WHERE m.id = ?
      GROUP BY m.id
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async findByBarcode(barcode) {
    const sql = `
      SELECT 
        m.*,
        COALESCE(SUM(b.quantity), 0) as total_stock,
        COUNT(b.id) as batch_count,
        MIN(b.expiry_date) as nearest_expiry
      FROM medicines m
      LEFT JOIN batches b ON m.id = b.medicine_id
      WHERE m.barcode = ?
      GROUP BY m.id
    `;
    const result = await query(sql, [barcode]);
    return result.rows[0];
  }

  static async update(id, medicineData) {
    const { name, description, category, manufacturer } = medicineData;
    const sql = `
      UPDATE medicines 
      SET name = ?, description = ?, category = ?, manufacturer = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await query(sql, [name, description, category, manufacturer, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const sql = 'DELETE FROM medicines WHERE id = ?';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async getStockAlerts() {
    const sql = `
      SELECT 
        m.name,
        m.barcode,
        m.category,
        COALESCE(SUM(b.quantity), 0) as total_stock,
        'low_stock' as alert_type
      FROM medicines m
      LEFT JOIN batches b ON m.id = b.medicine_id
      GROUP BY m.id, m.name, m.barcode, m.category
      HAVING COALESCE(SUM(b.quantity), 0) < 10
      
      UNION ALL
      
      SELECT 
        m.name,
        m.barcode,
        m.category,
        b.quantity as total_stock,
        'expiring_soon' as alert_type
      FROM medicines m
      JOIN batches b ON m.id = b.medicine_id
      WHERE b.expiry_date <= date('now', '+30 days')
        AND b.expiry_date > date('now')
      
      ORDER BY alert_type, total_stock
    `;
    const result = await query(sql);
    return result.rows;
  }
}

module.exports = Medicine;