
var router = require('express').Router();
const validator = require('validator');
const { getProduct } = require('../../database/index');
const { getImage, linkImage, getImages, deleteImage } = require('../../database/images');
const { createProduct, updateProduct, deleteProduct, isProductOrdered } = require('../../database/product');

router.get('/:pid', async function(req, res, next){
    // Check if pid is valid
    if (isNaN(req.params.pid)) {
        return res.status(400).json({ error: 'Invalid pid. It should be an id.' });
    }

    let product = await getProduct(req.params.pid);
    if (product === null) {
        return res.status(404).json({ error: 'Produit introuvable.' });
    } else {
        return res.json(product);
    }    
});

router.post('/', async function(req, res, next){
    // Check that the user is logged in
    if (!req.session.loggedin) {
        return res.status(401).json({ error: 'Vous devez être connecté pour ajouter un produit.' });
    }
    let uid = req.session.uid;

    // XSS protection
    let id = req.body.id;
    let pName = validator.escape(req.body.name);
    let pDescription = validator.escape(req.body.description);
    let pPrice = req.body.price;
    let pMass = req.body.mass;
    let pPhotosIds = req.body.photosIds;
    let pCategory = validator.escape(req.body.category);
    let pSpecifyCategory = validator.escape(req.body.specifyCategory);
    let pSize = validator.escape(req.body.size);
    let pState = req.body.state;

    // Check that all fields are filled
    if (!pName || !pName || !pDescription || !pPrice ||!pMass || !pPhotosIds || !pCategory || !pSpecifyCategory || !pSize || !pState) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs.' });
    }

    // Check that the price is a number
    if (isNaN(pPrice)){
        return res.status(400).json({ error: 'Veuillez spécifier un prix valide.' });
    }

    // Check that the mass is a number
    if (isNaN(pMass)){
        return res.status(400).json({ error: 'Veuillez spécifier une masse valide.' });
    }

    // Check that the price and the mass are positives
    if (pPrice < 1 || pMass < 1) {
        return res.status(400).json({ error: 'Veuillez spécifier des nombres positifs différents de 0.' });
    }

    // Check that the category is valid
    if (pCategory !== 'homme' && pCategory !== 'femme' && pCategory !== 'enfant') {
        return res.status(400).json({ error: 'Veuillez spécifier une catégorie valide.' });
    }

    // Check that the subcategory is not too long
    if (pSpecifyCategory.length > 1000) {
        return res.status(400).json({ error: 'Veuillez spécifier une sous-catégorie plus courte (taille anormale).' });
    }   

    // Check that the other images are valid
    // Check that the images exist and the author is the user
    for (let i = 0; i < pPhotosIds.length; i++) {
        if (isNaN(pPhotosIds[i]) || pPhotosIds[i] === "") {
            continue
        }
        image = await getImage(pPhotosIds[i], uid);
        if (image === null) {
            return res.status(400).json({ error: "L'image envoyée ne semble pas valide. Veuillez vous assurer d'avoir envoyé une image. Sinon veuillez contacter le support." });
        }
    }

    // Check that the state is valid
    if (isNaN(pState)) {
        return res.status(400).json({ error: 'Veuillez spécifier un état valide.' });
    }

    // Check that the state is a number between 0 and 4
    if (pState < 0 || pState > 4) {
        return res.status(400).json({ error: 'Veuillez spécifier un état valide.' });
    }

    // Check that images are a number and link them to the product
    for (let i = 0; i < pPhotosIds.length; i++) {
        if (isNaN(pPhotosIds[i])) {
            return res.status(400).json({ error: 'Veuillez spécifier une image valide.' });
        } else {
            pPhotosIds[i] = parseInt(pPhotosIds[i]);
            try {
                await linkImage(pPhotosIds[i], uid);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout de l\'image. Veuillez contacter le support.' });
            }
        }
    }

    // Remove the images of this author that are not used anymore
    let imagesToCheck = await getImages(uid);
    for (let i = 0; i < imagesToCheck.length; i++) {
        if (!imagesToCheck[i].linked) {
            try {
                if (!await deleteImage(imagesToCheck[i].id, uid)) {
                    console.error("Error while deleting image", imagesToCheck[i].id);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
    
    // Add the product to the database if id is not specified
    if (id) {
        try {
            await updateProduct({
                id: id,
                name: pName,
                description: pDescription,
                prices: [parseInt(pPrice)],
                mass: parseInt(pMass),
                size: pSize,
                kind: pCategory, // 'homme', 'femme', or 'enfant'
                state: pState,
                photos: pPhotosIds,
                specifyCategory: pSpecifyCategory,
                date: new Date(), // current date
            });
            return res.json({ success: 'Produit mis à jour avec succès.' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du produit. Veuillez contacter le support.' });
        }
    } else {
        try {
            await createProduct({
                name: pName,
                description: pDescription,
                prices: [parseInt(pPrice)],
                size: pSize,
                kind: pCategory, // 'homme', 'femme', or 'enfant'
                state: pState,
                photos: pPhotosIds,
                mass: parseInt(pMass),
                specifyCategory: pSpecifyCategory,
                date: new Date(), // current date
            });
            return res.json({ success: 'Produit ajouté avec succès.' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout du produit. Veuillez contacter le support.' });
        }
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // Check that the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }

    // Check that the id is valid
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Veuillez spécifier un id valide.' });
    }

    // Check that the product exists
    let product = await getProduct(id);
    if (product === null) {
        return res.status(400).json({ error: 'Le produit spécifié n\'existe pas.' });
    }

    // Delete the product
    try {
        // Check that the product is not ordered
        try {
            if (await isProductOrdered(id)) {
                return res.status(400).json({ error: 'Le produit spécifié est déjà commandé, vous devez annuler la commande avant de le supprimer.' });
            }    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit. ' + err });
        }
       
        let pid = await deleteProduct(id);
        if (pid === null) {
            return res.status(400).json({ error: 'Le produit spécifié n\'existe pas.' });
        }
        return res.json({ success: 'Produit supprimé avec succès.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit. Veuillez contacter le support.' });
    }

});

module.exports = router;
