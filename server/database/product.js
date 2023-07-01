const pool = require('../db');

async function createProduct(product) { 
  // get columns names of products table
  const { name, description, prices, size, kind, state, photos, date, specifyCategory } = product;
  const queryString = `
    INSERT INTO products (name, description, prices, size, kind, state, photos, date, "specifyCategory")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [name, description, prices, size, kind, state, photos, date, specifyCategory];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the inserted product
}
  
async function updateProduct(product) {
  const { id, name, description, prices, size, kind, state, photos, date, specifyCategory } = product;
  const queryString = `
    UPDATE products
    SET name = $1, description = $2, prices = $3, size = $4, kind = $5, state = $6, photos = $7, date = $8, specifyCategory = $9
    WHERE id = $10
    RETURNING *;
  `;
  const values = [name, description, prices, size, kind, state, photos, date, specifyCategory, id];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the updated product
}

async function deleteProduct(id) {
  const queryString = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the deleted product
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
};