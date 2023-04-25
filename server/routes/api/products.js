var router = require('express').Router();

const pool = require('../../db');

const selectAll = async () => {
    try {
      const result = await pool.query("SELECT * FROM products");
      console.log("print: ", result.rows);
      return result.rows;
    } catch (err) {
      console.error("error", err);
      return [];
    }
};
  
  


router.get('/:filter', async (req, res, next) => {
    result = await selectAll();
    console.log(result);
    if(req.params){
        return res.json({products: result});
    } else {
        return res.json({products: result});
    }
});


module.exports = router;
