var router = require('express').Router();


router.use('/products', require('./products'));
router.use('/product', require('./product'));
router.use("/login", require("./login"));
router.use("/upload-image", require("./upload"));
router.use("/order", require("./order"));
router.use("/payment", require("./payment"));

module.exports = router;
