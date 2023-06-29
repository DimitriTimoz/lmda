import React from 'react';
import Preview from '../components/products/Preview';
import './Home.css';

function Favorites() {
  // get the list of liked products from the localStorage
  let likes = localStorage.getItem("likes");
  if (likes) {
      likes = JSON.parse(likes);
  } else {
      likes = [];
  }
  // get the list of products from the localStorage
  let products = localStorage.getItem("products");
  if (products) {
      products = JSON.parse(products);
  } else {
      products = [];
  }
  // filter the products to get the liked ones
  products = products.filter((p) => likes.includes(p.id));

  // render the products
  return (
    <div>
        <h2>Favoris</h2>
        <div id="product-list">
          {products.map((product) => (
            <Preview product={product} key={product.id} />
          ))}
        </div>
                
    </div>
  );
}

export default Favorites;
