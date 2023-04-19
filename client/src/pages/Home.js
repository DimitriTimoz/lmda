import React from 'react';
import Preview from '../components/Preview';

function Home() {
  let products = {
    image: "/previews/preview.png",
    name: "T-shirt",
    size: "M",
    price: 20,
  }
  return (
    <div>
        <p>Home</p>
        <p>Home</p>
        <Preview product={products}/>
    </div>
  );
}

export default Home;
