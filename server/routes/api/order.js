const express = require('express');
const router = express.Router();
const myMondialRelay = require("../../modules/mondial-relay");
const mondialRelay = require("mondial-relay");
const db = require('../../db');
const { getUser, getEmail, getName } = require('../../database/users');
const { sendEmail } = require('../../modules/email');
const env = require('dotenv').config({path: './.env'}).parsed;
const stripe = require('stripe')(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

function noAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { force } = req.body;
    // Check is the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Order ID invalide.' });
    }

    let intentId;
    let amount;
    let userId;
    let date;
    // Check if the order is shipped
    if(!force) {
        try {
            const result = await db.query('SELECT status, payment_intent_id, total, user_id, created_at FROM orders WHERE id = $1', [id]);
            if (result.rows[0].status > 0) {
                return res.status(400).json({ error: 'Vous ne pouvez pas annuler une commande marquée comme expédiée.' });
            }
            intentId = result.rows[0].payment_intent_id;
            amount = result.rows[0].total;
            userId = result.rows[0].user_id;
            date = result.rows[0].created_at;
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande. Veuillez contacter le support.' });
        }

        // Refund the order
        let refund;
        let email = await getEmail(userId);
        try {
            refund = await stripe.refunds.create({
                payment_intent: intentId,
            });
        } catch (err) {
            return res.status(500).json({ error: 'Une erreur est survenue lors du remboursement de la commande. Veuillez contacter le support. Il est possible que la commande soit déjà remboursée ou que la méthode de paiement ne prenne pas en charge le remboursement. Vérifiez ces informations sur stripe et contactez le client. Email du client: ' + email, canForce: true });
        }
        if (refund.status !== 'succeeded' && refund.status !== 'pending') {
            return res.status(500).json({ error: 'Une erreur est survenue lors du remboursement de la commande. Veuillez contacter le support.' });
        }

        // Send an email to the user
        if(email) {
            if (!await sendEmail(email, 'Commande annulée', `canceled_order`, { order_id: id, amount: parseFloat(amount)/100, date: new Date(date).toLocaleDateString('fr-fr') })) {
                console.error('Error sending email to announce canceled order to ' + email);
            }
        }
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

router.get("/:id", async (req, res) => {
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
        // Parse addresses
        result.rows[0].address = JSON.parse(result.rows[0].address);
        return res.json({ order: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande. Veuillez contacter le support.' });
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
        const order = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (order.rows.length === 0) {
            return res.status(404).json({ error: 'Commande introuvable.'});
        }
        let user = await getUser(order.rows[0].user_id);
        if (user.length == 0) {
            return res.status(404).json({ error: 'Utilisateur introuvable.'});
        }
        user = user[0];

        // Parse addresses
        let delivery = order.rows[0].delivery;
        let address = JSON.parse(order.rows[0].address);
        let body = myMondialRelay.bodyLabel;
        body.Dest_Ad1 = noAccents(user.gender + " " + user.name);
        body.Dest_Ad3 = noAccents(address.address1);
        body.Dest_Ad4 = noAccents(address.address2 || "");
        body.Dest_CP = noAccents(address.zipCode);
        body.Dest_Ville = noAccents(address.city);
        body.LIV_Rel = delivery.parcelShopCode.split('-')[1];
        console.log(body);
        let label = await myMondialRelay.creationEtiquette(body);
        let num = label.url.split('expedition=')[1].split('&')[0];
        // Update the order to set the expedition number
        await db.query('UPDATE orders SET exp_number = $1 WHERE id = $2', [num, id]);
        return res.json({ label });
    } catch (err) {
        console.error(err);
        if (err[1] == 92) {
            return res.status(400).json({ error: 'Il est possible que votre crédit prépayé soit insuffisant. Erreur de mondial relay: ' + err[0] });
        } 
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande ou la création de l\'étiquette. Veuillez contacter le support. Erreur de mondial relay: ' + err[0] });
    }
});

router.put("/:id", async (req, res) => {
    // Check if the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }

    const { id } = req.params;

    // Check the parameters
    const { shipped, forced } = req.body;
    if (!shipped && forced == undefined) {
        return res.status(400).json({ error: 'Paramètres invalides.' });
    }

    // Update the order
    try {
        let status = 0;
        if (shipped) {
            status = 1;
        }
        
        if (status === 1) {
            // Get order
            let order = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
            if (order.rows.length === 0) {
                return res.status(404).json({ error: 'Commande introuvable.'});
            }
            order = order.rows[0];
            if (order.exp_number === null && !forced) {
                return res.status(400).json({ error: 'La commande n\'a pas encore d\'étiquette.' });
            }

            let email = await getEmail(order.user_id);
            if (email) {
                let zipCode = JSON.parse(order.address).zipCode;
                let name = "";
                try {
                    name = await getName(order.user_id);
                } catch (err) {
                    console.error(err);
                }
    
                if (!await sendEmail(email, "Commande traitée", "shipped", { numexp: order.exp_number, zipCode: zipCode, name: name, order_id: order.id })) {
                    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi de l\'email.' });
                }
            } else {
                console.error("No email for user " + order.user_id);
            }
        }
        await db.query('UPDATE orders SET status = $1 WHERE id = $2 AND paid = TRUE', [status, id]);
        return res.json({ success: 'Commande mise à jour avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la commande.' });
    }
});



module.exports = router;
