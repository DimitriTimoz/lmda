const { Product } = require('../models/product');

module.exports.getProduct = async function(pid) {
    const pool = require('../db');
    try {
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [pid]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Product(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].price, result.rows[0].size, result.rows[0].state, result.rows[0].photos, result.rows[0].date);
    } catch (err) {
        console.error("Error for getting the product:", err);
        return null;
    }
};

