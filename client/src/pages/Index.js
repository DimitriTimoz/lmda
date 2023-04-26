import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Home from './Home';
import Favorites from './Favorites';
import Cart from './Cart';
import Product from './Product';

function Index() {
  return (
    <div className="Index">
        <Header />
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product/>} />
        </Routes>
    </div>
  );
}

export default Index;
