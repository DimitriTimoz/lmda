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
        this.filters = "Vêtements:";
        this.filter_level = 2;
        this.dropdownRef = React.createRef(); 
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.dropdownRef && !this.dropdownRef.current.contains(event.target)) {
          this.setState({ active: false });
        }
    }
    

    getList() {
        return get_filters(this.props.elements);
    }

    incrementFilter(filter) {
       // console.log("Incrementing filter to " + filter);
      //  this.filter += ":" + filter;
       // this.filter_level++;
    }

    decrementFilter() {
       // this.filter = this.filter.split(":").slice(0, -1).join(":");
       // this.filter_level--;
    }

    getListAtLevel(level) {
        let filters = this.filters.split(":");
        if (level > filters.length) {
            console.error("Dropdown: Cannot get list at level " + level + " when filter level is " + this.filter_level);
            return [];
        }

        if (level === 0) {
            level = 1;
        }
       
        let list = this.getList();
        let items = [];
        let prefilter = filters.slice(0, level-1).join(":");
        for (let i = 0; i < list.length; i++) {
            if (list[i].startsWith(prefilter + ":") || prefilter === "") {
                // Check if the filter is already in the list
                let item = list[i].split(":")[level-1];
                if (!items.includes(item)) {
                    items.push(item);
                }
            }
        }
        return items;
        
    }

    getAllMatchingFilters() {
        let items = [];
        let list = this.getList();
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
        return items;
    }
    

    trigger() {
        this.setState({active: !this.state.active});
        //this.filters = "";
        //this.filter_level = 0;
    }

    render() {
        // Get all filters from level 0 to this.filter_level
        let range = [...Array(this.filter_level).keys()]
        let filters = range.map((i) => this.getListAtLevel(i+1));
        console.log(filters);
        return (
            <div ref={this.dropdownRef} className={this.state.active ? 'dropdown-menu active' : 'dropdown-menu'}>
                <div className='dopdown-selector' onClick={() => this.trigger()}>
                    <span className='selected-item-dp'>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <div className={ this.state.active ? 'dp-category' : 'dp-category hide' }>
                    {filters.map((items) => (
                    <ul className="dp-elements">
                        <li>
                            Tout
                        </li>
                        {items.map((element) => (
                            <li key={element} className='dp-eleemnt'>
                                <div onClick={this.incrementFilter(element)} className="dropdown-link">
                                    {element}
                                </div>
                            </li>
                        ))}
                    </ul>))}
                </div>
            </div>
        );    
    }
}
