import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../DropdownNav';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let elements = [
          {
            filter: "Vêtements",
            sub: [
              "Jean",
              "Chemises",
              "T-Shirt",
              "Pull",
              "Short"
            ]
          },
          {
            filter: "Chaussures",
            sub: [
              "Baskets",
              "Sandales",
              "Bottes",
              "Escarpins",
              "Mocassins"
            ]
          },
          {
            filter: "Accessoires",
            sub: [
              "Sacs",
              "Ceintures",
              "Chapeaux",
              "Montres",
              "Portefeuilles"
            ]
          }
    ];
    let nav;
    if (this.props.isAdmin) {
      nav = <nav></nav>
    } else {
      nav = <nav>
              <Dropdown elements={elements} placeholder={"femmes"} />
              <Dropdown elements={elements} placeholder={"hommes"} />
              <Dropdown elements={elements} placeholder={"enfants"} />
            </nav>
    }
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
      {nav}
    </div>
    );
  }
}