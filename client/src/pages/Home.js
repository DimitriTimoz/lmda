import React, { useEffect, useState } from 'react';
import Preview from '../components/products/Preview';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/all');
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
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
  } else {
    console.log("products", products);
  }

  return (
    <div>
      {products.map((product) => (
        <Preview product={product} key={product.id} />
      ))}
    </div>
  );
}

export default Home;
