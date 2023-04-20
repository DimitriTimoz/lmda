import './DropdownNav.css';
import React from 'react';
import { Link } from 'react-router-dom';


function get_filters(elements, prefilter = "") {
    let filters = [];
    for (let i = 0; i < elements.length; i++) {
      let currentFilter = elements[i].filter;
      if (prefilter !== "") {
        currentFilter = prefilter + ":" + currentFilter;
      }
      if (Array.isArray(elements[i].sub)) {
        let subFilters = get_filters(elements[i].sub, currentFilter);
        filters = filters.concat(subFilters);
      } else {
        filters.push(prefilter + ":" + elements[i]);
      }
    }
    return filters;
}

export default class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = {active: false};
        this.filters = "";
    }

    getList() {
        return get_filters(this.props.elements);
    }

    incrementFilter(filter) {
        this.filter += ":" + filter;
    }

    decrementFilter() {
        this.filter = this.filter.split(":").slice(0, -1).join(":");
    }

    trigger() {
        this.setState({active: !this.state.active});
    }

    render() {
        let list = this.getList();
        let items = [];
        // Extract all filters from elements
        for (let i = 0; i < list.length; i++) {
            // femmes:vêtements:jean
            // -> vêtements:jean if filter is "femmes"

            if (list[i].startsWith(this.filters + ":")) {
                items.push(list[i].slice(this.filters.length + 1));
            } else if (this.filters === "") {
                items.push(list[i]);
            }
        }
        return (
            <div className={this.state.active ? 'dropdown-menu active' : 'dropdown-menu'}>
                <div className='dopdown-selector' onClick={() => this.trigger()}>
                    <span className='selected-item-dp'>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <ul className={ this.state.active ? 'dp-elements' : 'dp-elements hide'}>
                    <li>
                        Tout
                    </li>
                    {items.map((element) => (
                        <li key={element} className='dp-eleemnt'>
                            <Link to={element} className="dropdown-link">
                                {element}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );    
    }
}
