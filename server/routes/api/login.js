var router = require('express').Router();
//const { addAdmin } = require('../../database/users');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
router.post('/', async function(req, res, next){
    const INVALID_IDs = { error: 'Veuillez spécifier un mot de passe et/ou une adresse email.' };

    if (req.session.loggedin) {
        return res.json({success: 'Vous êtes déjà connecté.'});
    }
    // Check if pid is valid
    var email = req.body.email;

    var password = req.body.password;

    if (email && password) {
        // Check if the user exists
        pool.query('SELECT * FROM admins WHERE email = $1', [email], function(error, results, fields) {
            if (error) {
                return res.status(500).json({ error: 'Erreur interne du serveur.' });
            }

            if (results && results.rowCount > 0) {
                const user = results.rows[0];

                // Compare the password
                bcrypt.compare(password, user.password, function(err, match) {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur interne du serveur.' });
                    }

                    if (match) {
                        req.session.loggedin = true;
                        req.session.email = email;
                        req.session.id = user.id;
                        return res.json({success: 'Vous êtes maintenant connecté.'});
                    } else {
                        return res.json(INVALID_IDs);
                    }
                });
            } else {
                return res.json(INVALID_IDs);
            }
        });
    } else {
        return res.json(INVALID_IDs);
    }
});

router.get('/', async function(req, res, next){
    if (req.session.loggedin) {
        return res.json({success: 'Vous êtes déjà connecté.'});
    } else {
        return res.json({error: 'Vous n\'êtes pas connecté.'});
    }
});

module.exports = router;
