
var router = require('express').Router();
const validator = require('validator');
const { getProduct } = require('../../database/index');
const { getImage } = require('../../database/images');

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
    let uid = req.session.id;

    // XSS protection
    
    console.log("req.body", req.body);
    let pName = validator.escape(req.body.name);
    let pDescription = validator.escape(req.body.description);
    let pPrice = validator.escape(req.body.price);
    let pHomeDeliveryPrice = validator.escape(req.body.homeDeliveryPrice);
    let pRelayDeliveryPrice = validator.escape(req.body.relayDeliveryPrice);
    let pPreviewImage = req.body.previewImage;
    let pOtherImages = req.body.otherImages;
    let pCategory = validator.escape(req.body.category);
    let pSubCategory = validator.escape(req.body.subCategory);
    let pSize = validator.escape(req.body.size);
    let pState = validator.escape(req.body.state);

    // Check if all fields are filled
    if (!pName || !pDescription || !pPrice || !pHomeDeliveryPrice || !pRelayDeliveryPrice || !pPreviewImage || !pOtherImages || !pCategory || !pSubCategory || !pSize) {
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
    if (pCategory !== 'Homme' && pCategory !== 'Femme' && pCategory !== 'Enfant') {
        return res.status(400).json({ error: 'Veuillez spécifier une catégorie valide.' });
    }

    // Check if the subcategory is valid
    if (pSubCategory.length === 0) {
        return res.status(400).json({ error: 'Veuillez spécifier une sous-catégorie.' });
    }

    // Check if the preview image is valid
    // Check if the image exists and the author is the user
    let images = await getImage(pPreviewImage, uid);
    if (images === null || images.length === 0) {
        return res.status(400).json({ error: "L'image envoyée ne semble pas valide. Veuillez vous assurer d'avoir envoyé une image. Sinon veuillez contacter le support." });
    }

    // Check if the other images are valid
    // Check if the images exist and the author is the user
    for (let i = 0; i < pOtherImages.length; i++) {
        images = await getImage(pOtherImages[i], uid);
        if (images === null || images.length === 0) {
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

    // Check if images are a number
    if (isNaN(pPreviewImage)) {
        return res.status(400).json({ error: 'Veuillez spécifier une image valide.' });
    }

    for (let i = 0; i < pOtherImages.length; i++) {
        if (isNaN(pOtherImages[i])) {
            return res.status(400).json({ error: 'Veuillez spécifier une image valide.' });
        }
    }

    
    // Link the images to the product

    // Remove the images of this author that are not used anymore

    


});


module.exports = router;
