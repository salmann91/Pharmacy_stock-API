const { query } = require('../config/database');

class Batch {
  static async create(batchData) {
    const { medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price } = batchData;
    const sql = `
      INSERT INTO batches (medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [medicine_id, batch_number, quantity, expiry_date, cost_price, selling_price]);
    return result.rows[0];
  }

  static async findByMedicineId(medicine_id) {
    const sql = `
      SELECT * FROM batches 
      WHERE medicine_id = $1 
      ORDER BY expiry_date ASC
    `;
    const result = await query(sql, [medicine_id]);
    return result.rows;
  }

  static async updateQuantity(id, quantity) {
    const sql = `
      UPDATE batches 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [quantity, id]);
    return result.rows[0];
  }

  static async getExpiringBatches(days = 30) {
    const sql = `
      SELECT 
        b.*,
        m.name as medicine_name,
        m.barcode
      FROM batches b
      JOIN medicines m ON b.medicine_id = m.id
      WHERE b.expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
        AND b.expiry_date > CURRENT_DATE
        AND b.quantity > 0
      ORDER BY b.expiry_date ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  static async delete(id) {
    const sql = 'DELETE FROM batches WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
}

module.exports = Batch;