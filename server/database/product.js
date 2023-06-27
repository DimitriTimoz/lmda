const pool = require('../db');

async function createProduct(product) {
    const { name, description, prices, size, kind, state, photos, date } = product;
    const queryString = `
      INSERT INTO products (name, description, prices, size, kind, state, photos, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [name, description, prices, size, kind, state, photos, date];
    const res = await pool.query(queryString, values);
    return res.rows[0]; // Returns the inserted product
  }
  
  async function updateProduct(product) {
    const { id, name, description, prices, size, kind, state, photos, date } = product;
    const queryString = `
      UPDATE products
      SET name = $1, description = $2, prices = $3, size = $4, kind = $5, state = $6, photos = $7, date = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [name, description, prices, size, kind, state, photos, date, id];
    const res = await pool.query(queryString, values);
    return res.rows[0]; // Returns the updated product
  }

module.exports = {
    createProduct,
    updateProduct
};