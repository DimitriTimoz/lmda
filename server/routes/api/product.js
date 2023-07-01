
var router = require('express').Router();
const validator = require('validator');
const { getProduct } = require('../../database/index');
const { getImage, linkImage, getImages, deleteImage } = require('../../database/images');
const { createProduct, updateProduct, deleteProduct } = require('../../database/product');

router.get('/:pid', async function(req, res, next){
    // Check if pid is valid
    if (isNaN(req.params.pid)) {
        return res.status(400).json({ error: 'Invalid pid. It should be an id.' });
    }

    let product = await getProduct(req.params.pid);
    if (product === null) {
        return res.status(404).json({ error: 'Product not found.' });
    } else {
        return res.json(product);
    }    
});

router.post('/', async function(req, res, next){
    // Check if the user is logged in
    if (!req.session.loggedin) {
        return res.status(401).json({ error: 'Vous devez être connecté pour ajouter un produit.' });
    }
    let uid = req.session.uid;

    // XSS protection
    let id = req.body.id;
    let pName = validator.escape(req.body.name);
    let pDescription = validator.escape(req.body.description);
    let pPrice = req.body.price;
    let pHomeDeliveryPrice = req.body.homeDeliveryPrice;
    let pRelayDeliveryPrice = req.body.relayDeliveryPrice;
    let pPhotosIds = req.body.photosIds;
    let pCategory = validator.escape(req.body.category);
    let pSpecifyCategory = validator.escape(req.body.specificCategory);
    let pSize = validator.escape(req.body.size);
    let pState = validator.escape(req.body.state);

    // Check if all fields are filled
    if (!pName || !pDescription || !pPrice || !pHomeDeliveryPrice || !pRelayDeliveryPrice || !pPhotosIds || !pCategory || !pSpecifyCategory || !pSize) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs.' });
    }

    // Check if the price is a number
    if (isNaN(pPrice) || isNaN(pHomeDeliveryPrice) || isNaN(pRelayDeliveryPrice)) {
        return res.status(400).json({ error: 'Veuillez spécifier des prix valides.' });
    }

    // Check if the price is positive
    if (pPrice < 0 || pHomeDeliveryPrice < 0 || pRelayDeliveryPrice < 0) {
        return res.status(400).json({ error: 'Veuillez spécifier des prix positifs.' });
    }

    // Check if the category is valid
    if (pCategory !== 'homme' && pCategory !== 'femme' && pCategory !== 'enfant') {
        return res.status(400).json({ error: 'Veuillez spécifier une catégorie valide.' });
    }

    // Check if the subcategory is valid
    if (pSpecifyCategory.length === 0) {
        return res.status(400).json({ error: 'Veuillez spécifier une sous-catégorie.' });
    }   

    // Check if the other images are valid
    // Check if the images exist and the author is the user
    for (let i = 0; i < pPhotosIds.length; i++) {
        if (isNaN(pPhotosIds[i]) || pPhotosIds[i] === "") {
            continue
        }
        image = await getImage(pPhotosIds[i], uid);
        if (image === null) {
            return res.status(400).json({ error: "L'image envoyée ne semble pas valide. Veuillez vous assurer d'avoir envoyé une image. Sinon veuillez contacter le support." });
        }
    }

    // Check if the state is valid
    if (isNaN(pState)) {
        return res.status(400).json({ error: 'Veuillez spécifier un état valide.' });
    }

    if (pState < 0 || pState > 4) {
        return res.status(400).json({ error: 'Veuillez spécifier un état valide.' });
    }

    // Check if images are a number and link them to the product
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
                prices: [parseInt(pPrice), parseInt(pHomeDeliveryPrice), parseInt(pRelayDeliveryPrice)],
                size: pSize,
                kind: pCategory, // 'homme', 'femme', or 'enfant'
                state: pState,
                photos: pPhotosIds,
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
                prices: [parseInt(pPrice), parseInt(pHomeDeliveryPrice), parseInt(pRelayDeliveryPrice)],
                size: pSize,
                kind: pCategory, // 'homme', 'femme', or 'enfant'
                state: pState,
                photos: pPhotosIds,
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
    // Check is the user is logged in
    if (!req.session.uid) {
        return res.status(401).json({ error: 'Vous devez être connecté pour effectuer cette action.' });
    }

    // Check if the id is valid
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Veuillez spécifier un id valide.' });
    }

    // Check if the product exists
    let product = await getProduct(id);
    if (product === null) {
        return res.status(400).json({ error: 'Le produit spécifié n\'existe pas.' });
    }

    // Delete the product
    try {
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
