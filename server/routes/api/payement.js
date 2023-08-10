var router = require('express').Router();
const env = require('dotenv').config({path: './.env'}).parsed;
const { valid_payement, payement_canceled } = require('../../database/payement');
const db = require('../../db');
const stripe = require('stripe')(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

router.get('/config', (req, res) => {
    res.status(200).json({
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post('/create-payment-intent', async (req, res) => {
    let { products, delivery, email, phone } = req.body;

    if (!products || !delivery || !email || !phone) {
        return res.status(400).json({ message: 'Infos manquantes.' });
    }

    // Protect adress and email against SQL injections and XSS attacks
    email = req.sanitize(email);
    delivery.address = req.sanitize(delivery.address);

    let total = 0;
    let user = null;
    try {
      // Créez un nouvel utilisateur ou trouvez un utilisateur existant
      user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
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

      for (let i = 0; i < productsDb.rows.length; i++) {
          const product = productsDb.rows[i];
          total += product.prices[0]
      }

      // Check that total is an acceptable amount
      if (total < 50) {
          return res.status(400).json({ message: 'Le montant total de votre commande est trop faible.' });
      }

      // Créez la nouvelle commande
      const order = await db.query(
          'INSERT INTO orders (user_id, products, date, total, status, address) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING *',
          [user.id, products, total, 0, delivery.address]  
      );

      // Mettez à jour les produits pour marquer qu'ils ont été commandés
      for (let i = 0; i < products.length; i++) {
          await db.query('UPDATE products SET ordered = TRUE WHERE id = $1', [products[i]]);
      }

      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong.' });
  }
  


  try{
    const paymentIntent = await stripe.paymentIntents.create({
      shipping: {
        name: user.name,
        address: {

        },
      },
      currency: 'eur',
      amount: total,
      automatic_payment_methods: { enabled: true }
    });
  
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      error: {
        message: e.message,
      },
      });
    }
});

router.post('/webhook', async (req, res) => {
    let data, eventType;
  
    // Check if webhook signing is configured.
    if (env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    if (eventType === 'payment_intent.succeeded') {
      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      if ((await valid_payement(data.object.id)).length !== 1) {

      } else {
        console.log("❌ order doesn't exists.");
      }
    } else if (eventType === 'payment_intent.payment_failed') {
        if (await payement_canceled(data.object.id)) {
            console.log("❌ order canceled.");
        }
    }
    res.sendStatus(200);
  });
  
  

module.exports = router;
