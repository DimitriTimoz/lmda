
var router = require('express').Router();

const { getProduct } = require('../../database/index');

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


module.exports = router;
