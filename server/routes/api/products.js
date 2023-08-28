var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');

const selectAll = async (admin, kind, from = 0, more = 10) => {
  // Get all products
  let kindCondition = '';
  let values = [];
  if (kind !== 'all') {
    kindCondition = `AND kind = '${kind}'`;
  }
  let queryString = `SELECT * FROM products WHERE (ordered = false ` + kindCondition + `) ORDER BY date DESC OFFSET $1 LIMIT $2;`;
  values = [from, more];
  let result = await pool.query(queryString, values);
  let products = result.rows;
  for (let i = 0; i < products.length; i++) {
    // Get the images filenames
    products[i].photos = await getImagesFilenames(products[i].photos);
  }

  return products;
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
  const {from, more} = req.query;
  let category = req.params.category;
  // if end with 's' remove it
  if (category[category.length - 1] === 's') {
    category = category.slice(0, -1);
  }
  result = await selectAll(false, category, from, more);
  return res.json({products: result});  
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
