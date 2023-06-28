import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import DropdownNav from '../DropdownNav';
import {CAREGORIES_HOMMES, CAREGORIES_FEMMES} from '../../data/index';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    let nav;
    if (this.props.isAdmin) {
      nav = <nav></nav>
    } else {
      nav = <nav>
              <DropdownNav elements={CAREGORIES_FEMMES} placeholder={"femmes"} />
              <DropdownNav elements={CAREGORIES_HOMMES} placeholder={"hommes"} />
              <DropdownNav elements={CAREGORIES_HOMMES} placeholder={"enfants"} />
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