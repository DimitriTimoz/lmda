const db = require('../db');

// Update the order to mark it as paid
async function valid_payement(stripe_id) {
    try {
        const query = `UPDATE orders SET paid = TRUE WHERE payment_intent_id = $1 `;
        const { rows } = await db.query(query, [stripe_id]);
        return rows;
    } catch (error) {
        console.error('Error getting images:', error.message);
        return [];
    }
}

// Update the order to mark it as canceled and make the products available again
async function payement_canceled(stripe_id) {
    try {
        const query = `UPDATE orders SET paid = FALSE WHERE payment_intent_id = $1 `;
        const { rows } = await db.query(query, [stripe_id]);
        if (rows.length !== 1) {
            return false;
        }
        const order = rows[0];
        const products = order.products;
        for (let i = 0; i < products.length; i++) {
            await db.query('UPDATE products SET ordered = FALSE WHERE id = $1', [products[i]]);
        }
        return true;
    } catch (error) {
        console.error('Error getting images:', error.message);
        return false;
    }
}
        

module.exports = {
    valid_payement,
    payement_canceled
};