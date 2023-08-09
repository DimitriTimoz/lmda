const db = require('../db');

async function valid_payement(stripe_id) {
    try {
        const query = `UPDATE orders SET paid = TRUE WHERE stripe_id = $1 `;
        const { rows } = await db.query(query, [stripe_id]);
        return rows;
    } catch (error) {
        console.error('Error getting images:', error.message);
        return [];
    }
}

module.exports = {
    valid_payement
};