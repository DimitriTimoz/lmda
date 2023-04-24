var router = require('express').Router();

router.use('/products', require('./products'));
router.use('/product', require('./product'));

module.exports = router;
