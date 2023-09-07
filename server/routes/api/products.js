var router = require('express').Router();
const { getImagesFilenames } = require('../../database/images');
const pool = require('../../db');
const validator = require('validator');

const selectAll = async (kind, filter, from = 0, more = 10) => {
  // Get all products
  let kindCondition = '';
  let values = [];
  if (kind !== 'all') {
    kindCondition = `AND kind = '${kind}'`;
  }

  if (filter !== 'all') {
    // Start with filter
    kindCondition += ` AND ("specifyCategory" LIKE '${filter}%' OR "specifyCategory" = '${filter}') `;
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
  

router.get('/:category/:filter', async (req, res, next) => {
  const {from, more} = req.query;
  let category = req.params.category;
  let filter = validator.escape(req.params.filter.toLowerCase().split(" ").join("-"));
  // if end with 's' remove it
  if (category[category.length - 1] === 's') {
    category = category.slice(0, -1);
  }
  result = await selectAll(category, filter, from, more);
  return res.json({products: result});  
});

module.exports = router;
