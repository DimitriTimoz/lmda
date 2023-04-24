var router = require('express').Router();

router.get('/:filter', function(req, res, next){
    console.log(req.pid);
    if(req.params){
        return res.json({filter: req.params.filter});
    } else {
        return res.json({isFavorite: false});
    }
});


module.exports = router;
