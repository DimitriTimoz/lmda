var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');

const selectAll = async (admin, k = null) => {
    try {
      let query = "SELECT id, name, description, prices, size, kind, \"specifyCategory\", state, photos, date, mass FROM products WHERE ordered = false AND shipped = false";
      if (admin) {
        query = "SELECT * FROM products";
      }
      if (k) {
        query += ` ORDER BY date ASC LIMIT ${k}`;
      }
      const result = await pool.query(query);
      rows = result.rows;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].photos === null) {
          rows[i].photos = [];
        } else {
          rows[i].photos = await getImagesFilenames(rows[i].photos);
        }
      }
      return rows;
    } catch (err) {
      console.error("error", err);
      return [];
    }
};
  

function applyFilter(products, category, filter) {
  filter = filter.toLocaleLowerCase().replace(" ", "-");
  category = category.toLocaleLowerCase().replace(" ", "-");
  if (category !== 'all') {
    products = products.filter((product) => {
        return product.kind.toLowerCase().replace(" ", "-").includes(category);
    });
  }

  if (filter === 'all') {
      return products;
  } else {
    return products.filter((product) => {
      if (product.specifyCategory === null) {
        return false;
      }
   
      return product.specifyCategory.toLowerCase().replace(" ", "-").includes(filter);
    });
  }
}
  


router.get('/:category/:filter', async (req, res, next) => {
    result = await selectAll(false, 100);
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
  // Check that the user is logged in
  if (!req.session.loggedin) {
    return res.status(401).json({ error: 'Vous devez être connecté pour récupérer les produits en tant qu\'administrateur.' });
  } 

  let category = req.params.category;

  // if end with 's' remove it
  if (category[category.length - 1] === 's') {
    category = category.slice(0, -1);
  }

  // Get all products as an admin
  result = await selectAll(true);
  result = applyFilter(result, category, req.params.filter);
  
  return res.json({products: result});
});



module.exports = router;
