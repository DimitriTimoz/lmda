var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');

const selectAll = async (admin) => {
    try {
      let query = "SELECT * FROM products";
      if (admin) {
        query = "SELECT (id, name, description, prices, size, kind, state, photos, date) FROM products WHERE ordered = false AND delivered = false";
      }
      const result = await pool.query("SELECT * FROM products");
      rows = result.rows;
      for (let i = 0; i < rows.length; i++) {
        rows[i].photos = await getImagesFilenames(rows[i].photos);
      }
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
    result = await selectAll(false);
    result = applyFilter(result, req.params.filter);
    if(req.params){
        return res.json({products: result});
    } else {
        return res.json({products: result});
    }
});


router.get('/admin/:filter', async (req, res, next) => {
  // Check if the user is logged in
  if (!req.session.loggedin) {
    return res.status(401).json({ error: 'Vous devez être connecté pour ajouter un produit.' });
  } 

  result = await selectAll(true);
  result = applyFilter(result, req.params.filter);
  if(req.params){
      return res.json({products: result});
  } else {
      return res.json({products: result});
  }
});



module.exports = router;
