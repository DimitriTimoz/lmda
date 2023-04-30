import './DropdownNav.css';
import React from 'react';

function get_filters(elements, prefilter = "") {
    let filters = [];
    for (let i = 0; i < elements.length; i++) {
      let currentFilter = elements[i].filter;
      if (prefilter !== "") {
        currentFilter = prefilter + ":" + currentFilter;
      }
      if (Array.isArray(elements[i].subs)) {
        let subsFilters = get_filters(elements[i].subs, currentFilter);
        filters = filters.concat(subsFilters);
      } else {
        filters.push(prefilter + ":" + elements[i]);
      }
    }
    return filters;
}

export default class DropdownNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.props.filters = "";
        this.filter_level = 1;
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

    incrementFilter = (e) => {
        e.preventDefault();
        let level = parseInt(e.target.getAttribute("level"));
        let filter = e.target.innerText;
        this.filter_level = level+1;
        this.props.filters = this.props.filters.split(":").slice(0, level-1).join(":");
        if (this.props.filters !== "") {
            this.props.filters += ":" + filter;
        } else {
            this.props.filters = filter;
        }
        this.forceUpdate();
    }

    getListAtLevel(level) {
        let filters = this.props.filters.split(":");
        if (level > filters.length + 1) {
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

            if (list[i].startsWith(this.props.filters + ":")) {
                items.push(list[i].slice(this.props.filters.length + 1));
            } else if (this.props.filters === "") {
                items.push(list[i]);
            }
        }
        return items;
    }
    

    trigger = () => {
        this.setState({active: !this.state.active});
        
        if (!this.state.active) {
            this.props.filters = "";
            this.filter_level = 1;
        }
    }

    render() {
        // Get all filters from level 0 to this.filter_level
        let range = [...Array(this.filter_level).keys()]
        let filters = range.map((i) => [i+1, this.getListAtLevel(i+1)]);
        return (
            <div ref={this.dropdownRef} className="dropdown-menu">
                <div className='dropdown-selector' onClick={() => this.trigger()}>
                    <span className={this.state.active ? 'selected-item-dp active' : 'selected-item-dp'}>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <div className={ this.state.active ? 'dp-category' : 'dp-category hide' }>
                    {filters.map((items) => (
                    <ul className="dp-elements">
                        <li>
                            Tout
                        </li>
                        {items[1].map((element) => (
                            <li key={element} className='dp-elemnt'>
                                <div level={items[0]} onClick={this.incrementFilter} className="dropdown-link">
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
