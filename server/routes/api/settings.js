var router = require('express').Router();
const db = require('../../db');

router.put("/", async (req, res, next) => {
    // Check that the user is logged in
    if (!req.session.loggedin) {
        return res.status(401).json({ error: 'Vous devez être connecté pour modifier vos paramètres.' });
    }

    // Get the body
    const body = req.body;
    // For each key of the body, check if it is valid
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            const value = body[key];
            // insert the setting or update it if it already exists
            try {
                await db.query('INSERT INTO settings (name, value) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET value = $2', [key, value]);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour des paramètres. ' + err  });
            }
        }
    }
});

router.get("/", async (req, res, next) => {
    // Get all the settings
    try {
        let settings = await db.query('SELECT * FROM settings');
        let result = {};
        for (let i = 0; i < settings.rows.length; i++) {
            const setting = settings.rows[i];
            result[setting.name] = setting.value;
        }
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des paramètres.' });
    }
});


module.exports = router;
