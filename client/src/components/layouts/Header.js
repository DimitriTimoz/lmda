import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import DropdownNav from '../DropdownNav';
import {CAREGORIES_HOMMES, CAREGORIES_FEMMES} from '../../data/index';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBurgerMenuOpen: false
    }

    this.triggerMenu = this.triggerMenu.bind(this);
  }

  triggerMenu = () => {
    this.setState({isBurgerMenuOpen: !this.state.isBurgerMenuOpen});
  }

  render() {
    
    let burgerMenuSrc = "";
    let hideMobile = "hide-mobile";
    let no_overflow = <></>;
    if (this.state.isBurgerMenuOpen) {
      burgerMenuSrc = '/icons/burger-menu-unfold.svg';
      hideMobile = "";
      if (window.innerWidth < 700) {
        no_overflow = <style>{'body {overflow: hidden;}'}</style>;
        window.scrollTo(0, 0);
      }
  
    } else {
      burgerMenuSrc = '/icons/burger-menu.svg';
    }
    
    let nav;
    if (this.props.isAdmin) {
      nav = <nav></nav>
    } else {
      nav = <nav className={hideMobile}>
              <DropdownNav elements={CAREGORIES_FEMMES} category="femmes" selector={ false } placeholder={"femmes"} />
              <DropdownNav elements={CAREGORIES_HOMMES} category="hommes" selector={ false } placeholder={"hommes"} />
              <DropdownNav elements={CAREGORIES_HOMMES} category="enfants"selector={ false } placeholder={"enfants"} />
            </nav>
    }
    return (
     <div>
      <header>
        <div className="burger-menu-trigger">
          <img alt="burger-menu" src={burgerMenuSrc} onClick={this.triggerMenu}/>
        </div> 
        <Link to="/"><img id="app-logo" alt="logo" src="/logo.png"/></Link>
        <Link to="/" className='app-name-container'><h1>Le monde d'Anna</h1></Link>
        <div className="personnal-nav">
            <Link to="/favorites"><img alt="favorites" src='/icons/heart.svg'/></Link>
            <Link to="/cart"><img alt="cart" src='/icons/basket.svg'/></Link>
        </div>
      </header>
      {nav}
      {no_overflow}
    </div>
    );
  }
}