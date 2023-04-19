import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './DropdownNav';


export default function Header({ }) {
    let elements = [
        {id: 1, title: 'Accueil', path: '/'},
        {id: 2, title: 'Favoris', path: '/favorites'},
    ]
    
    return (
     <div>
      <header>
        <Link to="/"><img alt="logo" src="/logo.png"/></Link>
        <Link to="/"><h1>Le monde d'Anna</h1></Link>
        <div className="personnal-nav">
            <Link to="/favorites"><img alt="favorites" src='/icons/heart.svg'/></Link>
            <Link to="/cart"><img alt="cart" src='/icons/basket.svg'/></Link>
        </div>
      </header>
      <nav>
        <Dropdown elements={elements} placeholder={"femmes"} />
        <Dropdown elements={elements} placeholder={"hommes"} />
        <Dropdown elements={elements} placeholder={"enfants"} />
      </nav>
    </div>
    );
}