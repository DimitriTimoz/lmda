import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Home from './Home';
import Favorites from './Favorites';
import Cart from './Cart';
import Product from './Product';
import Products from './Products';
import {loadStripe} from '@stripe/stripe-js';
import {useEffect, useState} from 'react';
import Completion from './Completion';
import Contact from './Contact';

function Index() {
  const [ stripePromise, setStripePromise ] = useState(null);
  
  useEffect(() => {
    fetch("/api/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });

    fetch('/api/settings').then(async (r) => {
      const settings = await r.json();
      localStorage.setItem('settings', JSON.stringify(settings));
    });

  }, []);

  return (
    <div className="Index">
        <Header />
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart stripePromise={stripePromise} />} />
            <Route path="/product/:id" element={<Product/>} />
            <Route path="/products/:category/:filter?" element={<Products/>} />
            <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
            <Route path="/contact" element={<Contact/>} />
        </Routes>
    </div>
  );
}

export default Index;
