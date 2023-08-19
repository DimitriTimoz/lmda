var router = require('express').Router();
const { getUser, changePassword } = require('../../database/users');

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

router.post('/change-password', async (req, res, next) => {

    // Check that the user is logged in
    if (!req.session.loggedin) {
        return res.status(401).json({ error: 'Vous devez être connecté pour modifier votre mot de passe.' });
    }

    // Check that the request contains all the required fields
    if (!req.body.password || !req.body.newPassword || !req.body.newPasswordConfirm || !req.body.email) {
        return res.status(400).json({ error: 'Requête invalide. Veuillez remplir tous les champs.' });
    }

    // Check that the new password and the confirmation are the same
    if (req.body.newPassword !== req.body.newPasswordConfirm) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe et la confirmation ne correspondent pas.' });
    }

    // Check that the new password is different from the old one
    if (req.body.password === req.body.newPassword) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit être différent de l\'ancien.' });
    }

    // Check that the new password is at least 8 characters long
    if (req.body.newPassword.length < 8) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au moins 8 caractères.' });
    }

    // Check that the new password is not too long
    if (req.body.newPassword.length > 50) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au plus 50 caractères.' });
    }

    // Check that the new password contains at least one lowercase letter
    if (!/[a-z]/.test(req.body.newPassword)) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au moins une lettre minuscule.' });
    }

    // Check that the new password contains at least one uppercase letter
    if (!/[A-Z]/.test(req.body.newPassword)) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au moins une lettre majuscule.' });
    }

    // Check that the new password contains at least one digit
    if (!/[0-9]/.test(req.body.newPassword)) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au moins un chiffre.' });
    }

    // Check that the new password contains at least one special character
    if (!/[!@#$%^&*]/.test(req.body.newPassword)) {
        return res.status(400).json({ error: 'Requête invalide. Le nouveau mot de passe doit contenir au moins un caractère spécial parmis les suivants: !@#$%^&*' });
    }

    // Check that the admin exists
    if (await changePassword(req.body.email, req.body.password, req.body.newPassword)) {
        return res.json({ message: 'Mot de passe modifié avec succès.' });
    } else {
        return res.status(400).json({ error: 'Requête invalide. L\'adresse email ou le mot de passe est incorrect.' });
    }
});        

module.exports = router;
