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
  
  
const insertOne = async () => {
    try {
      const result = await pool.query("INSERT INTO products (name, description, price, size, kind, state, photos, date) VALUES ('test', 'test', 1, 1, 'test', 1, '{test}', '2020-01-01')")
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return [];
    }
};
  
insertOne();


router.get('/:filter', function(req, res, next){
    console.log(req.pid);
    if(req.params){
        return res.json({filter: selectAll()});
    } else {
        return res.json({products: selectAll()});
    }
});


module.exports = router;
