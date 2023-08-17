const express = require('express');
const router = express.Router();

const db = require('../../db');

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // Check is the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    // Cancel the order. Set ordered to false for each product in the order by getting the order with one product id
    try {
        // Set products in order to not ordered
        await db.query('UPDATE products SET ordered = false WHERE id IN (SELECT unnest(products) FROM orders WHERE id = $1);', [id]);
        await db.query('DELETE FROM orders WHERE id = $1', [id]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'annulation de la commande. Veuillez contacter le support.' });
    }
    // TODO: refund the user and send an email
    return res.json({ success: 'Commande annulée avec succès.' });

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

// Get my order if id and stripe payment intent id match
router.post('/get', async (req, res) => {
    const { id, paymentIntentId } = req.body;
    // Get the order
    try {
        const result = await db.query('SELECT products FROM orders WHERE id = $1 AND payment_intent_id = $2 AND paid = FALSE', [id, paymentIntentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Commande introuvable ou déjà payée.'});
        }
        return res.json({ order: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande. Veuillez contacter le support.' });
    }
});


module.exports = router;
