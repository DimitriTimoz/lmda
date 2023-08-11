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

function Index() {
  const [ stripePromise, setStripePromise ] = useState(null);

  useEffect(() => {
    fetch("/api/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
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
            <Route path="/products/:category/:filter" element={<Products/>} />
            <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
        </Routes>
    </div>
  );
}

export default Index;
