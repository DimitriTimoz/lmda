const express = require('express');
const router = express.Router();

const db = require('../../db');

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // Check is the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    // TODO: refund the user and send an email
    // Cancel the order. Set ordered to false for each product in the order by getting the order with one product id
    try {
        await db.query('UPDATE products SET ordered = FALSE FROM orders CROSS JOIN LATERAL unnest(orders.products) AS product WHERE product = $1 AND products.id = product', [id]);
        return res.json({ success: 'Commande annulée avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'annulation de la commande. Veuillez contacter le support.' });
    }
});

router.get("/all", async (req, res) => {
    // Check if the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    // Get all orders
    try {
        const result = await db.query('SELECT * FROM orders');
        return res.json({ orders: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commandes. Veuillez contacter le support.' });
    }
});



module.exports = router;
