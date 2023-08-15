const pool = require('../db');
const { deleteImage } = require('./images');
const { getProduct } = require('./index');

async function createProduct(product) { 
  // get columns names of products table
  const { name, description, prices, size, kind, state, photos, date, specifyCategory, mass } = product;
  const queryString = `
    INSERT INTO products (name, description, prices, size, kind, state, photos, date, "specifyCategory", mass)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [name, description, prices, size, kind, state, photos, date, specifyCategory, mass];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the inserted product
}
  
async function updateProduct(product) {
  const { id, name, description, prices, size, kind, state, photos, date, specifyCategory, mass } = product;
  const queryString = `
    UPDATE products
    SET name = $1, description = $2, prices = $3, size = $4, kind = $5, state = $6, photos = $7, date = $8, "specifyCategory" = $9, mass = $10
    WHERE id = $11
    RETURNING *;
  `;
  const values = [name, description, prices, size, kind, state, photos, date, specifyCategory, mass, id];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the updated product
}

async function deleteProduct(id) {
  // Get the images to delete
  const product = await getProduct(id);
  const images = product.photos;
  // Delete the images
  for (let i = 0; i < images.length; i++) {
    await deleteImage(images[i]);
  }
  // Delete the product
  const queryString = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id];
  const res = await pool.query(queryString, values);
  return res.rows[0]; // Returns the deleted product
}

async function isProductOrdered(pid) {
  // Check if the product is ordered
  const queryString = `
    SELECT ordered
    FROM products
    WHERE id = $1;
  `;
  const values = [pid];
  try {
    const rows = await pool.query(queryString, values);
    if (rows.length === 0) {
      throw new "Product not found"
    }
    return rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    isProductOrdered
};