const pool = require('../db');

async function getImage(id, author) {
    try {
        const query = `
            SELECT * FROM images
            WHERE id = $1, author = $2
        `;
        const { rows } = await pool.query(query, [id, author]);
        return rows;
    } catch (error) {
        console.error('Error getting image:', error.message);
        return []
    }
}

module.exports = {
    getImage
};