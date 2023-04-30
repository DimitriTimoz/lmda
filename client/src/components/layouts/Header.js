import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import DropdownNav from '../DropdownNav';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let elements = [
          {
            filter: "Vêtements",
            subs: [
              "Jean",
              "Chemises",
              "T-Shirt",
              "Pull",
              "Short"
            ]
          },
          {
            filter: "Chaussures",
            subs: [
              "Baskets",
              "Sandales",
              "Bottes",
              "Escarpins",
              "Mocassins"
            ]
          },
          {
            filter: "Accessoires",
            subs: [
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
              <DropdownNav elements={elements} placeholder={"femmes"} />
              <DropdownNav elements={elements} placeholder={"hommes"} />
              <DropdownNav elements={elements} placeholder={"enfants"} />
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