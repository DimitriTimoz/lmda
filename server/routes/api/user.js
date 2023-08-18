var router = require('express').Router();
const { getUser } = require('../../database/users');

router.get('/:id', async (req, res, next) => {
    // Check that the user is logged in
    if (!req.session.loggedin) {
        return res.status(401).json({ error: 'Vous devez être connecté pour ajouter un produit.' });
    }

    // Get the user
    try {
        let user = await getUser(req.params.id);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Utilisateur introuvable.' });
        }
        return res.json(user[0]);

    } catch (error) {
        return res.status(500).json({ error: 'Erreur serveur. Impossible de récupérer les informations de l\'utilisateur.' });
    }


});

module.exports = router;
