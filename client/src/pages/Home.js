import React, { Component } from 'react';
import Preview from '../components/products/Preview';
import axios from 'axios';
import './Home.css';

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
    this.state = {
      products: null,
      news: [],
      men: [],
      women: [],
      childs: []
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const response = await axios.get('/api/products/all/all');
      if (Array.isArray(response.data.products)) {
        let products = response.data.products.reverse();
        let women = applyFilter(products, "femme", "all")
        let men = applyFilter(products, "homme", "all")
        let childs = applyFilter(products, "enfant", "all")
        this.setState({ products: products, news: products, childs: childs, men: men, women: women });
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('productsDate', Date.now());
      } else {
        console.error('API response is not an array:', response.data.products);
        this.setState({ products: [] });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setState({ products: [] });
    }
  }

  render() {
    const { products, news, men, women, childs } = this.state;

    if (products === null) {
      return <div>Loading...</div>;
    }

    return (
      <div id="product-list">
        <div className='product-category'>
          <h3>Nouveautées</h3>
          <div className='products-raw'>
            {news.map((product) => (
              <Preview product={product} key={product.id} />
            ))}
          </div>
        </div>
        <div className='product-category'>
          <h3>Femmes</h3>
          <div className='products-raw'>
            {women.map((product) => (
              <Preview product={product} key={product.id} />
            ))}
          </div>
        </div>
        <div className='product-category'>
          <h3>Hommes</h3>
          <div className='products-raw'>
            {men.map((product) => (
              <Preview product={product} key={product.id} />
            ))}
          </div>
        </div>
        <div className='product-category'>
          <h3>Enfants</h3>
          <div className='products-raw'>
            {childs.map((product) => (
              <Preview product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
