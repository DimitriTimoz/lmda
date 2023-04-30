import React from "react";
import "./DropdownNav.css";

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.props.value = "";
    }

    render() {
        let list = this.props.elements;

        let items = [];
        for (let i = 0; i < list.length; i++) {
            items.push(<li key={i} onClick={this.incrementFilter} className='dp-elemnt'>{list[i]}</li>);
        }

        return (
            <div className="dropdown-menu" ref={this.dropdownRef}>
                <div className="dropdown-selector" onClick={this.toggleDropdown}>
                    <span className={this.state.active ? 'selected-item-dp active' : 'selected-item-dp'}>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <div className={ this.state.active ? 'dropdown-content' : 'dropdown-content hide' }>
                    <ul className="dp-elements">
                        {items}
                    </ul>
                </div>
            </div>
        );

    }
}