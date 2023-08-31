import React, { Component } from 'react';
import './Home.css';
import TxtButton from '../components/TxtButton';
import RawPreviews from '../components/products/RawPreviews';

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
      if (!product.specifyCategory) {
        return false;
      }
      return product.specifyCategory.toLowerCase().includes(filter);
    });
  }
}
  

class Home extends Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <div id="product-list">
        <div className='product-category'>
          <div className="header-row">
            <h3>Nouveautés</h3>
            <TxtButton title="Voir plus" link="/products/all/all" />
          </div>
          <RawPreviews category="all" filter="all" />
        </div>
        <div className='product-category'>
          <div className="header-row">
            <h3>Femmes</h3>
            <TxtButton title="Voir plus" link="/products/femmes/all" />
          </div>
          <RawPreviews category="femmes" filter="all" />
        </div>
        <div className='product-category'>
          <div className="header-row">
            <h3>Hommes</h3>
            <TxtButton title="Voir plus" link="/products/hommes/all"/>
          </div>
          <RawPreviews category="hommes" filter="all" />
        </div>
        <div className='product-category'>
          <div className="header-row">
            <h3>Enfants</h3>
            <TxtButton title="Voir plus" link="/products/enfants/all"/>
          </div>
          <RawPreviews category="enfants" filter="all" />
        </div>
      </div>
    );
  }
}

export default Home;
