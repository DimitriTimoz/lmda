import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ }) {
    return (
      <header>
        <Link to="/"><img alt="logo" src="/logo.png"/></Link>
        <Link to="/"><h1>Le monde d'Anna</h1></Link>
        <div className="personnal-nav">
            <Link to="/favorites"><img alt="favorites" src='/icons/heart.svg'/></Link>
            <Link to="/cart"><img alt="cart" src='/icons/basket.svg'/></Link>
        </div>
      </header>
    );
}