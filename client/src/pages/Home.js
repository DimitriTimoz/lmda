import React from 'react';
import Preview from '../components/products/Preview';

function Home() {
  let products = {
    image: "/previews/preview.png",
    name: "T-shirt",
    size: "M",
    price: 20,
    id: 1
  }
  return (
    <div>
        <Preview product={products}/>
    </div>
  );
}

export default Home;
