const express = require('express');
const router = express.Router();

const db = require('../../db');

router.post('/', async (req, res) => {
    let { products, delivery, email, phone } = req.body;

    if (!products || !delivery || !email || !phone) {
        return res.status(400).json({ message: 'Infos manquantes.' });
    }

    // Check if the email is valid
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Veuillez spécifier une adresse email valide.' });
    }

    // Protect adress and email against SQL injections and XSS attacks
    email = req.sanitize(email);
    delivery.address = req.sanitize(delivery.address);

    try {
        // Créez un nouvel utilisateur ou trouvez un utilisateur existant
        let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            user = await db.query('INSERT INTO users (email, phone, address) VALUES ($1, $2, $3) RETURNING *', [email, phone, delivery.address]);
        } else {
            user = user.rows[0];
        }

        // Check that products are ids
        if (products.some(id => isNaN(id))) {
            return res.status(400).json({ message: 'Certains produits sont incorrects.' });
        }

        const productsDb = await db.query('SELECT * FROM products WHERE id = ANY($1) AND ordered = FALSE', [products]);
        if (productsDb.rows.length !== products.length) {
            return res.status(400).json({ message: 'Certains produits n\'existent pas ou sont déjà commandés.' });
        }

        let total = 0;
        for (let i = 0; i < productsDb.rows.length; i++) {
            const product = productsDb.rows[i];
            total += product.prices[0]
        }
        // Créez la nouvelle commande
        const order = await db.query(
            'INSERT INTO orders (user_id, products, date, total, status, address) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING *',
            [user.id, products, total * 100, 0, delivery.address]  
        );

        // Mettez à jour les produits pour marquer qu'ils ont été commandés
        for (let i = 0; i < products.length; i++) {
            await db.query('UPDATE products SET ordered = TRUE WHERE id = $1', [products[i]]);
        }

        res.status(201).json(order.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // Check is the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }
    // Cancel the order. Set ordered to false for each product in the order by getting the order with one product id
    try {
        await db.query('UPDATE products SET ordered = FALSE FROM orders CROSS JOIN LATERAL unnest(orders.products) AS product WHERE product = $1 AND products.id = product', [id]);
        return res.json({ success: 'Commande annulée avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'annulation de la commande. Veuillez contacter le support.' });
    }
});


module.exports = router;
