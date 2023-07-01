import './DropdownNav.css';
import React from 'react';
import { Link } from 'react-router-dom';

function get_filters(elements, prefilter = "", classicDpd = false) {
    let filters = [];
    for (let i = 0; i < elements.length; i++) {
        // If element is an object, it has subs
        if (classicDpd) {
            filters.push(elements[i]);
        } else {
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
    }
    return filters;
}

export default class DropdownNav extends React.Component {
    constructor(props) {
        super(props);
        let selector = this.props.selector || false;
        this.state = {
            selector: selector,
            active: false,
            selection: "",
            category: this.props.category || "",
        };
        this.filters = this.props.value || "";
        this.filter_level = 1;
        this.dropdownRef = React.createRef(); 
    }

    returnFilters() {
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: this.filters
                }
            });
        }
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
        return get_filters(this.props.elements, "", this.props.classicDpd);
    }

    incrementFilter = (e) => {
        e.preventDefault();
        let level = parseInt(e.target.getAttribute("level"));
        let filter = e.target.innerText;
        this.filter_level = level+1;
        this.filters = this.filters.split(":").slice(0, level-1).join(":");
        
        if (this.filters !== "") {
            this.filters += ":" + filter;
        } else {
            this.filters = filter;
        }
        this.returnFilters();

        this.setState({
            selection: this.filters,
        });
    }

    getListAtLevel(level) {
        let filters = this.filters.split(":");
        if (level > filters.length + 1) {
            console.error("Dropdown: Cannot get list at level " + level + " when filter level is " + this.filter_level);
            return [[], ""];
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
        return [items, prefilter];
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
    

    trigger = () => {
        this.setState({active: !this.state.active});
        
        if (!this.state.active) {
            this.filters = "";
            this.filter_level = 1;
        }
    }

    render() {
        // Get all filters from level 0 to this.filter_level
        let range = [...Array(this.filter_level).keys()]
        let filters = range.map((i) => {
            let [items, prefilter] = this.getListAtLevel(i+1); // destructure the array return
            return [i+1, items, prefilter]; // return an array with the items and prefilter
        });

        return (
            <div ref={this.dropdownRef} className="dropdown-menu">
                <div className='dropdown-selector' onClick={() => this.trigger()}>
                    <span className={this.state.active ? 'selected-item-dp active' : 'selected-item-dp'}>{this.props.placeholder}</span>
                    <img alt="arrow" className={this.state.active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg'/>
                </div>
                <div className={ this.state.active ? 'dp-category' : 'dp-category hide' }>
                {filters.map((items) => ( items[1].length > 0 &&
                <ul className="dp-elements">
                    {!this.state.selector && <li>
                        <Link to={"/products/" + this.state.category + "/" + (items[0] === 0 ? "all" : items[2].toLocaleLowerCase().replace(" ", "-"))}>Tout</Link>
                    </li>}
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
