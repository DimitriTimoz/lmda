var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');

const selectAll = async () => {
    try {
      const result = await pool.query("SELECT * FROM products");
      rows = result.rows;
      for (let i = 0; i < rows.length; i++) {
        rows[i].photos = await getImagesFilenames(rows[i].photos);
      }
      console.log("rows", rows);
      return rows;
    } catch (err) {
      console.error("error", err);
      return [];
    }
};
  

function applyFilter(products, filter) {
    if (filter === 'all') {
        return products;
    }

    return products.filter((product) => {
        return product.kind.toLowerCase().includes(filter);
    });
  }
  


router.get('/:filter', async (req, res, next) => {
    result = await selectAll();
    result = applyFilter(result, req.params.filter);
    if(req.params){
        return res.json({products: result});
    } else {
        return res.json({products: result});
    }
});


module.exports = router;
