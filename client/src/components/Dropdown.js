import './Dropdown.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = {active: false};
        console.log(this.state);
    }

    trigger() {
        this.setState({active: !this.state.active});
    }

    render() {
        return (
            <div className={this.state.active ? 'dropdown-menu active' : 'dropdown-menu'}>
                <div className='dopdown-selector' onClick={() => this.trigger()}>
                    <span className='selected-item-dp'>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <ul className={this.state.active ? '' : 'hide'}>
                    {this.props.elements.map((element) => (
                        <li key={element.id}>
                            <Link to={element.path} className="dropdown-link">
                                {element.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );    
    }
}
