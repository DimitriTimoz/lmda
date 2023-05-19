var router = require('express').Router();


router.use('/products', require('./products'));
router.use('/product', require('./product'));
router.use("/login", require("./login"));
console.log("loading routing image");
router.use("/upload-image", require("./upload"));
console.log("loaded routing image");
module.exports = router;
