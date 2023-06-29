const { Product } = require('../models/product');
const { getImagesFilenames } = require('../database/images');

module.exports.getProduct = async function(pid) {
    const pool = require('../db');
    try {
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [pid]);
        if (result.rows.length === 0) {
            return null;
        }
        return {
            id: result.rows[0].id,
            name: result.rows[0].name,
            description: result.rows[0].description,
            prices: result.rows[0].prices,
            size: result.rows[0].size,
            kind: result.rows[0].kind,
            state: result.rows[0].state,
            photo_ids: result.rows[0].photos,
            photos: await getImagesFilenames(result.rows[0].photos), // updated this line
            date: result.rows[0].date,
        }
    } catch (err) {
        console.error("Error for getting the product:", err);
        return null;
    }
};


