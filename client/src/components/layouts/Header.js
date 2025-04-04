import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import DropdownNav from '../DropdownNav';
import {CAREGORIES_HOMMES, CAREGORIES_FEMMES, CAREGORIES_ENFANTS} from '../../data/index';
import HamburgerMenu from './HamburgerMenu';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBurgerMenuOpen: false,
      phone: false,
    }

    this.triggerMenu = this.triggerMenu.bind(this);
  }

  triggerMenu = () => {
    this.setState({isBurgerMenuOpen: !this.state.isBurgerMenuOpen});
  }

  updateDimensions = () => {
    this.setState({phone: window.innerWidth < 700});
    if (window.innerWidth < 700 && this.state.isBurgerMenuOpen) {
      window.scrollTo(0, 0);
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    let burgerMenuSrc = "";
    if (this.state.isBurgerMenuOpen) {
      burgerMenuSrc = '/icons/burger-menu-unfold.svg';
    } else {
      burgerMenuSrc = '/icons/burger-menu.svg';
    }
    
    return (
     <div>
      <header>
        <div className="burger-menu-trigger">
          <img alt="burger-menu" src={burgerMenuSrc} onClick={this.triggerMenu}/>
        </div> 
        <Link to="/"><img id="app-logo" alt="logo" src="/logo.png"/></Link>
        <Link to={this.props.isAdmin ? "/admin" : "/"} className='app-name-container'>
          <h1>Le monde d'Anna</h1>
          <h2>Vêtements de seconde main...</h2>
        </Link>
        {this.props.isAdmin ?
          <div className="personnal-nav">
              <Link to="/admin/add"><img alt="admin add item" src='/icons/add.svg'/></Link>
              <Link to="/admin/change-password"><img alt="change password" src='/icons/user.png'/></Link>
              <Link to="/admin/settings"><img alt="settings" src='/icons/setting.png'/></Link>
              
          </div>
        :
          <div className="personnal-nav">
              <Link to="/favorites"><img alt="favorites" src='/icons/heart.svg'/></Link>
              <Link to="/cart"><img alt="cart" src='/icons/basket.svg'/></Link>
          </div>
        }
        
      </header>
      {!this.props.isAdmin &&
        <nav className="hide-mobile">
          <DropdownNav elements={CAREGORIES_FEMMES} category="femmes" selector={ false } placeholder={"femmes"} />
          <DropdownNav elements={CAREGORIES_HOMMES} category="hommes" selector={ false } placeholder={"hommes"} />
          <DropdownNav elements={CAREGORIES_ENFANTS} category="enfants"selector={ false } placeholder={"enfants"} />
        </nav>
      }
      
      {this.state.isBurgerMenuOpen && !this.props.isAdmin &&
        <nav className="hide-desktop"> 
            <HamburgerMenu onClose={this.triggerMenu}/>
        </nav>
      }
    </div>
    );
  }
}