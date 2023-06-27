const pool = require('../db');

async function addProduct() {
    try {
        const query = `
            INSERT INTO products (name, description, price, image)
            VALUES ($1, $2, $3, $4)
        `;
        const { rows } = await pool.query(query, [name, description, price, image]);
        return rows;
    } catch (error) {
        console.error('Error adding product:', error.message);
        throw error;
    }
}