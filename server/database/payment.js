const db = require('../db');
const { sendEmail } = require('../modules/email');
const { getEmail } = require('./users');
// Update the order to mark it as paid
async function validPayment(stripe_id) {
    try {
        const query = `UPDATE orders SET paid = TRUE WHERE payment_intent_id = $1`;
        let res = await db.query(query, [stripe_id]);;
        return res.rowCount === 1;
    } catch (error) {
        console.error('Error updating orders as paid:', error.message);
        return false;
    }
}

// Update the order to mark it as canceled and make the products available again
async function paymentCanceled(stripe_id) {
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
        console.error('Error setting payment canceled:', error.message);
        return false;
    }
}
        
async function removeOrder(order_id) {
    // Recursively remove the order and its products
    try {
        const query = `DELETE FROM orders WHERE id = $1`;
        const { rows } = await db.query(query, [order_id]);
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
        console.error('Error removing order:', error.message);
        return false;
    }

}

async function checkExpiredOrders() {
    try {
        const INTERVAL = '10 minutes'; // Remove the single quotes here

        const query = `SELECT * FROM orders WHERE paid = FALSE AND created_at < NOW() - INTERVAL '${INTERVAL}'`;
        const { rows } = await db.query(query);

        if (rows.length === 0) {
            return true;
        }
        for (let i = 0; i < rows.length; i++) {
            const order = rows[i];
            const products = order.products;

            for (let j = 0; j < products.length; j++) {
                await db.query('UPDATE products SET ordered = FALSE WHERE id = $1', [products[j]]);
            }

            // User
            const user = await db.query('SELECT name, email FROM users WHERE id = $1', [order.user_id]);
            if (user.rows.length === 0) {
                console.error('Error getting user:', order.user_id);
                continue;
            }
            const email = user.rows[0].email;
            const name = user.rows[0].name;
            if (!await sendEmail(email, "Commande expirée", 'expired', { name: name })) {
                console.error('Error sending email to user:', email);
            }

        }
        await db.query(`DELETE FROM orders WHERE paid = FALSE AND created_at < NOW() - INTERVAL '${INTERVAL}'`);
        return true;
    } catch (error) {
        console.error('Error checking if order expired:', error.message);
        return false;
    }
}


module.exports = {
    validPayment,
    paymentCanceled,
    removeOrder,
    checkExpiredOrders,
};