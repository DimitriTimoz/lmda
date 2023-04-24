var router = require('express').Router();

router.get('/:pid', function(req, res, next){
    console.log(req.pid);
    if(req.payload){
        return res.json({isFavorite: req.payload.favorites.includes(req.params.pid)});
    } else {
        return res.json({isFavorite: false});
    }
});


module.exports = router;
