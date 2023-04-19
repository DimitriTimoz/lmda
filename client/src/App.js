import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Favorites from './pages/Favorites';
import Home from './pages/Home'
import Cart from './pages/Cart'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
