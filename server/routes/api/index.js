var router = require('express').Router();


router.use('/products', require('./products'));
router.use('/product', require('./product'));
router.use("/login", require("./login"));
router.use("/upload-image", require("./upload"));
module.exports = router;
