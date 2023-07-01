var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');

const selectAll = async (admin) => {
    try {
      let query = "SELECT * FROM products";
      if (admin) {
        query = "SELECT (id, name, description, prices, size, kind, 'specifyCategory', state, photos, date) FROM products WHERE ordered = false AND delivered = false";
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
  

function applyFilter(products, category, filter) {
  filter = filter.toLowerCase();
  category = category.toLowerCase();

  if (category !== 'all') {
    products = products.filter((product) => {
        return product.kind.toLowerCase().includes(category);
    });
  }

  if (filter === 'all') {
      return products;
  } else {
    return products.filter((product) => {
      if (product.specifyCategory === null) {
        return false;
      }
      return product.specifyCategory.toLowerCase().includes(filter);
    });
  }
}
  


router.get('/:category/:filter', async (req, res, next) => {
    result = await selectAll(false);
    let category = req.params.category;
    // if end with 's' remove it
    if (category[category.length - 1] === 's') {
      category = category.slice(0, -1);
    }

    result = applyFilter(result, category, req.params.filter);
    if(req.params){
        return res.json({products: result});
    } else {
        return res.json({products: result});
    }
});


router.get('/admin/:category/:filter', async (req, res, next) => {
  // Check if the user is logged in
  if (!req.session.loggedin) {
    return res.status(401).json({ error: 'Vous devez être connecté pour ajouter un produit.' });
  } 
  let category = req.params.category;
  // if end with 's' remove it
  if (category[category.length - 1] === 's') {
    category = category.slice(0, -1);
  }

  result = await selectAll(true);
  result = applyFilter(result, category, req.params.filter);
  if(req.params){
      return res.json({products: result});
  } else {
      return res.json({products: result});
  }
});



module.exports = router;
