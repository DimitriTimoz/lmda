import React, { useEffect, useState } from 'react';
import Preview from '../components/products/Preview';
import axios from 'axios';
import './Home.css';

function Home() {
  const [products, setProducts] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/all/all');
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          // Save it in the localStorage
          localStorage.setItem('products', JSON.stringify(response.data.products));
          // Add a timestamp to the localStorage
          localStorage.setItem('productsDate', Date.now());
        } else {
          console.error('API response is not an array:', response.data.products);
          setProducts([]);  // Set products to an empty array if the API response is not an array
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);  // Set products to an empty array if an error occurred
      }
    };
    
    fetchProducts();
  }, []);

  if (products === null) {
    return <div>Loading...</div>;
  } 
  return (
    <div id="product-list">
      {products.map((product) => (
        <Preview product={product} key={product.id} />
      ))}
    </div>
  );
}

export default Home;
