const express = require('express');
const router = express.Router();
const mondialRelay = require("../../modules/mondial-relay");
const db = require('../../db');
const { getUser } = require('../../database/users');

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
        // Parse addresses
        for (let i = 0; i < result.rows.length; i++) {
            result.rows[i].address = JSON.parse(result.rows[i].address);
        }
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

router.get("/bordereau/:id", async (req, res) => {
    // Check if the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    const { id } = req.params;
    // Get the order
    try {
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Commande introuvable.'});
        }
        let user = await getUser(result.rows[0].user_id);
        if (user.length == 0) {
            return res.status(404).json({ error: 'Utilisateur introuvable.'});
        }
        user = user[0];

        // Parse addresses
        let delivery = result.rows[0].delivery;
        let body = mondialRelay.body;
        body.Dest_Ad1 = user.gender + " " + user.name;
        /*body.Dest_Ad3 = address.address1;
        body.Dest_Ad4 = address.address2;
        body.Dest_CP = address.zipCode;
        body.Dest_Ville = address.city;*/
        body.Dest_Tel1 = user.tel;
        body.LIV_Rel = delivery.parcelShopCode;

        let label = await mondialRelay.creationEtiquette(body);
        

        return res.json({ label });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande. Veuillez contacter le support.' });
    }
});

router.put("/:id", async (req, res) => {
    // Check if the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }

    const { id } = req.params;

    // Check the parameters
    const { shipped } = req.body;
    if (shipped === undefined) {
        return res.status(400).json({ error: 'Paramètres invalides.' });
    }

    // Update the order
    try {
        let status = 0;
        if (shipped) {
            status = 1;
        }
        
        await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
        return res.json({ success: 'Commande mise à jour avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la commande. Veuillez contacter le support.' });
    }
});



module.exports = router;
