var router = require('express').Router();
const env = require('dotenv').config({path: './.env'}).parsed;
const { validPayment, paymentCanceled, removeOrder } = require('../../database/payment');
const { getAdminEmails } = require('../../database/users');
const db = require('../../db');
const { sendEmail, sendEmailOnlyTxt } = require('../../modules/email');
const stripe = require('stripe')(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

function getDeliveryPrice(mass, iso) {
  let isos = [['FR'], ['BE', 'LU'], ['NL'], ['ES', 'PT'], ['DE'], [], ['IT', 'AT']];
  let indexOfCountry = isos.findIndex((element) => element.includes(iso));
  if (mass < 500)
    return [440, 460, 555, 680, 1150, 1290, 1450][indexOfCountry];
  else if (mass < 1000)
    return [490, 540, 605, 720, 1150, 1290, 1450][indexOfCountry];
  else if (mass < 2000)
    return [650, 680, 705, 810, 1290, 1350, 1550][indexOfCountry]; 
  else if (mass < 3000)
    return [705, 750, 830, 950, 1290, 1750, 1790][indexOfCountry];
  else if (mass < 4000)
    return [730, 830, 890, 1050, 1490, 1790, 1850][indexOfCountry];
  else if (mass < 5000)
    return [1150, 1190, 1190, 1140, 1490, 1820, 1990][indexOfCountry];
  else if (mass < 7000)
    return [1390, 1430, 1430, 1360, 1750, 2490, 2550][indexOfCountry];
  else if (mass < 10000)
    return [1490, 1540, 1540, 1640, 2290, 2550, 2590][indexOfCountry];
  else if (mass < 15000)
    return [2190, 2250, 2250, 2190, 2290, 3390, 3390][indexOfCountry];
  else if (mass < 20000)
    return [2490, 2750, 2750, 2890, 3090, 4590, 4590][indexOfCountry];
  else if (mass < 30000)
    return [3090, 3390, 3390, 3590, 3790, 5590, 5590][indexOfCountry];
  else 
    return 999999999;
}

function checkEmail(email) {
  match =  email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!match) {
    return false;
  }
  return true;
};

function checkPhone(phone) {
  match = phone.match(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  );
  if (!match) {
    return false;
  }
  return true;
};

async function computeDeliveryPrice(products) {
  // Compute the mass of the products
  let mass = 0;
  for (let i = 0; i < products.length; i++) {
      const product = products[i];
      mass += product.mass;
  }

  let price = 0;
  // Compute the price according to the mass
  return price
}

function checkAndFormatInput(body) {
  let infos = body.infos;
  let products = body.products;
  let address = body.delivery.address;
  let delivery = body.delivery.delivery;

  if (!infos || !products || !address || !delivery) {
      return { error: 'Infos manquantes, veuillez compléter tous les champs.' };
  }

  if (!delivery.id || !delivery.name || !delivery.country || !delivery.address1 || !delivery.city || !delivery.zipCode || !delivery.parcelShopCode) {
    return { error: 'Infos de livraison manquantes, veuillez choisir un point relais valide.' };
  }

  if (!infos.email || !infos.name || !infos.gender || !infos.tel) {
      return { error: 'Infos personnelles manquantes, veuillez compléter tous les champs.' };
  }

  if (!address.address1 || !address.city || !address.zipCode || !address.country) {
      return { error: 'Adresse manquante, veuillez compléter tous les champs.' };
  }

  // Check size to prevent ddos
  if (products.length > 100) {
    return { error: 'Trop de produits, veuillez réduire la taille du panier.' };
  }

  if (products.length === 0) {
    return { error: 'Panier vide, veuillez ajouter des produits.' };
  }

  if (infos.email.length > 100 || infos.name.length > 100 || infos.tel.length > 20 || infos.gender.length > 4) {
    return { error: 'Un ou plusieurs champs de vois vos informations personnelles contiennent trop de caractères, veuillez réduire la taille de ces champs.' };
  }

  infos.email = infos.email.toUpperCase().replace(/\s/g, '')
  infos.tel = infos.tel.toUpperCase().replace(/\s/g, '')
  // Check email
  if (!checkEmail(infos.email)) {
    return { error: 'Email invalide.' };
  }

  // Check phone
  if (!checkPhone(infos.tel)) {
    return { error: 'Téléphone invalide.' };
  }

  // Check address
  if (address.address1.length > 100 || (address.address2 && address.address2.length > 100) || address.city.length > 100 || address.zipCode.length > 10) {
    return { error: 'Trop de caractères dans votre adresse, veuillez réduire la taille des champs.' };
  }

  address.address1 = address.address1.toUpperCase()
  if (address.address2) {
    address.address2 = address.address2.toUpperCase()
  }
  address.city = address.city.toUpperCase()
  address.zipCode = address.zipCode.toUpperCase().replace(/\s/g, '')

  // Check delivery
  if (delivery.id.length > 10 || delivery.name.length > 100 || delivery.country.length > 100 || delivery.address1.length > 100 || delivery.city.length > 100 || delivery.zipCode.length > 10 || delivery.parcelShopCode.length > 100) {
    return { error: 'Trop de caractères dans votre point relais, veuillez réduire la taille des champs.' };
  }
  
  return { infos, products, address, delivery };
}

router.get('/config', (req, res) => {
    res.status(200).json({
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post('/create-payment-intent', async (req, res) => {
  let body = checkAndFormatInput(req.body);
  if (body.error) {
    return res.status(400).json({ message: body.error });
  }
  const { infos, products, address, delivery } = body;

  let total = 0;
  let user = null;
  let order = null;
  let mass = 0;

  try {
    // Créez un nouvel utilisateur ou trouvez un utilisateur existant
    user = await db.query('SELECT * FROM users WHERE email = $1', [infos.email]);
    if (user.rows.length === 0) {
      let query = await db.query('INSERT INTO users (email, phone, name, gender) VALUES ($1, $2, $3, $4) RETURNING *', [infos.email, infos.tel, infos.name, infos.gender]);
      user = query.rows[0];
    } else {
      let query = await db.query('UPDATE users SET phone = $1, name = $2, gender = $3 WHERE email = $4 RETURNING *', [infos.tel, infos.name, infos.gender, infos.email]);
      user = query.rows[0];
    }

    // Check that products are ids
    if (products.some(id => isNaN(id))) {
        return res.status(400).json({ message: 'Certains produits sont incorrects.' });
    }

    // Check that products are available
    const productsDb = await db.query('SELECT * FROM products WHERE id = ANY($1) AND ordered = FALSE', [products]);
    if (productsDb.rows.length !== products.length) {
        return res.status(400).json({ message: 'Certains produits n\'existent pas ou sont déjà commandés.' });
    }

    // Compute the total price without delivery
    for (let i = 0; i < productsDb.rows.length; i++) {
        const product = productsDb.rows[i];
        total += product.prices[0]
        mass += product.mass;
    }

    // Check that total is an acceptable amount
    if (total < 50) {
        return res.status(400).json({ message: 'Le montant total de votre commande est trop faible.' });
    }

    // Check max mass
    if (mass > process.env.MAX_MASS) {
        return res.status(400).json({ message: 'Le poids total de votre commande est trop élevé pour être livré en point relais.' });
    }

    // Create the order
    order = await db.query(
        'INSERT INTO orders (user_id, products, date, total, status, address, delivery) VALUES ($1, $2, NOW(), $3, $4, $5, $6) RETURNING id',
        [user.id, products, total, 0, JSON.stringify(address), JSON.stringify(delivery)]  
    );

    if (order.rows.length === 0) {
        return res.status(500).json({ message: 'Une erreur est survenue, veuillez nous contacter pour régler cette erreur.' });
    }
    order = order.rows[0];
    // Set products as ordered
    for (let i = 0; i < products.length; i++) {
        await db.query('UPDATE products SET ordered = TRUE WHERE id = $1', [products[i]]);
    }

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Une erreur est survenue, veuillez nous contacter pour régler cette erreur.' });
  }
  // Compute the total amount
  let deliveryPrice = await computeDeliveryPrice(products);
  total += deliveryPrice;

  try{
    const paymentIntent = await stripe.paymentIntents.create({
      shipping: {
        name: user.name,
        address: {
          line1: address.address1,
          line2: address.address2,
          city: address.city,
          postal_code: address.zipCode,
          country: address.country,
        },
      },
      currency: 'eur',
      amount: total,
      automatic_payment_methods: { enabled: true }
    });
    // Set the stripe payment intent id in the database
    try {
      await db.query('UPDATE orders SET payment_intent_id = $1 WHERE id = $2', [paymentIntent.id, order.id]);
    } catch (error) {
      console.error(error);
      // Cancel the payment intent
      await stripe.paymentIntents.cancel(paymentIntent.id);
      await removeOrder(order.id);
      
      return res.status(500).json({ message: 'Une erreur est survenue, veuillez nous contacter pour régler cette erreur.' });
    }
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      deliveryPrice: deliveryPrice,
      total: total,
      mass: mass,
      orderId: order.id
    });
  } catch (e) {
    console.log(e);
    await removeOrder(order.id);
    return res.status(400).send({
        message: "Impossible de soumettre une demande de paiement. Une erreur est survenue, veuillez nous contacter pour régler cette erreur."
      
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
    console.log("🔔  event: ", eventType);
    if (eventType === 'payment_intent.succeeded') {
      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      if ((await validPayment(data.object.id))) {
        console.log("✅ order paid. Stripe payment intent id: " + data.object.id);
      } else {
        console.log("❌ order doesn't exists. Stripe payment intent id: " + data.object.id);
        res.sendStatus(400);
      }
    } else if (eventType === 'payment_intent.payment_failed') {
        if (await paymentCanceled(data.object.id)) {
            console.log("❌ order canceled.");
        }
    } else if (eventType === 'charge.refund.updated') {
      // Send email to admins
      for (let i = 0; i < data.object.refunds.data.length; i++) {
        const refund = data.object.refunds.data[i];
        if (refund.status === 'succeeded') {
          console.log("✅ order refunded.");
          break;
        } else {
          const adminEmails = getAdminEmails();
          for (let i = 0; i < adminEmails.length; i++) {
            const adminEmail = adminEmails[i];
            await sendEmailOnlyTxt(adminEmail, "Erreur remboursement", "Une erreur est survenue lors du remboursement de la commande " + data.object.id + ". Vous pouvez effectuer le remboursement manuellement depuis le dashboard Stripe. Stripe object: " + data.object);
          }
          console.log("❌ order refund failed.");
        }
      }
    }
    res.sendStatus(200);
  });

module.exports = router;
