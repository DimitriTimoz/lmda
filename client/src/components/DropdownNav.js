import './DropdownNav.css';
import React from 'react';
import { Link } from 'react-router-dom';

class DropdownNav extends React.Component {
    static get_filters(elements, prefilter = "", classicDpd = false) {
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
                    let subsFilters = DropdownNav.get_filters(elements[i].subs, currentFilter);
                    filters = filters.concat(subsFilters);
                } else {
                    filters.push(prefilter + ":" + elements[i]);
                }
            }
        }
        return filters;
    }

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            filter: "",
        };
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

    returnFilters() {
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: this.state.filter
                }
            });
        }
    }

    incrementFilter = (e) => {
        e.preventDefault();
        let level = parseInt(e.target.getAttribute("level"));
        let filter = e.target.innerText;
        this.filter_level = level + 1;
        let filter_final = this.state.filter.split(":").slice(0, level - 1).join(":");

        if (filter_final !== "") {
            filter_final += ":" + filter;
        } else {
            filter_final = filter;
        }
        this.setState({
            filter: filter_final,
        });
        this.returnFilters();
    }

    trigger = () => {
        this.setState((prevState) => ({
            active: !prevState.active,
        }));
    }

    getList() {
        return DropdownNav.get_filters(this.props.elements, "", this.props.classicDpd);
    }

    getFiltersAtLevel(level) {
        const filters = this.state.filter.split(":");
        if (level > filters.length + 1) {
            console.error("Dropdown: Cannot get list at level " + level + " when filter level is " + this.filter_level);
            return [[], ""];
        }

        if (level === 0) {
            level = 1;
        }

        const list = this.getList();
        let items = [];
        const prefilter = filters.slice(0, level - 1).join(":");
        for (let i = 0; i < list.length; i++) {
            if (list[i].startsWith(prefilter + ":") || prefilter === "") {
                // Check if the filter is already in the list
                let item = list[i].split(":")[level - 1];
                if (!items.includes(item)) {
                    items.push(item);
                }
            }
        }
        return [items, prefilter];
    }

    getAllMatchingFilters = () => {
        let items = [];
        const list = this.getList();
        // Extract all filters from elements
        console.log("filters: " + this.state.filter);
        for (let i = 0; i < list.length; i++) {
            // femmes:vêtements:jean
            // -> vêtements:jean if filter is "femmes"
            if (list[i].startsWith(this.state.filter + ":")) {
                items.push(list[i].slice(this.state.filter.length + 1));
            } else if (this.state.filter === "") {
                items.push(list[i]);
            }
        }
        return items;
    }

    render() {
        const { active } = this.state;
        const range = [...Array(this.filter_level).keys()];
        // Get the level max possible
        const maxLevel = this.getList().reduce((max, filter) => {
            const level = filter.split(":").length;
            return level > max ? level : max;
        }, 0);
        const filters = range.map((i) => {
            const [items, prefilter] = this.getFiltersAtLevel(i + 1);
            return [i + 1, items, prefilter, i === maxLevel-1];
        });

        return (
            <div ref={this.dropdownRef} className="dropdown-menu">
                <div className='dropdown-selector' onClick={this.trigger}>
                    <span className={active ? 'selected-item-dp active' : 'selected-item-dp'}>{this.props.placeholder}</span>
                    <img alt="arrow" className={active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg' />
                </div>
                <div className={active ? 'dp-category' : 'dp-category hide'}>
                    {filters.map(([level, items, prefilter, last_level]) => (items.length > 0 &&
                        <ul className="dp-elements" key={level}>
                            {!this.props.selector && <li>
                                <Link to={"/products/" + this.props.category + "/" + (level === 0 ? "all" : prefilter.toLocaleLowerCase().replace(" ", "-"))}>Tout</Link>
                            </li>}
                            {items.map((element) => (
                                <li key={element} className='dp-element'>
                                    {!last_level ?
                                        <div level={level} onClick={this.incrementFilter} className="dropdown-link">
                                            {element} 
                                        </div>
                                        :
                                        <Link to={"/products/" + this.props.category + "/" + prefilter.toLocaleLowerCase().replace(" ", "-") + ":" + element.toLocaleLowerCase().replace(" ", "-")} className="dropdown-link">
                                            {element}
                                        </Link>}
                                        
                                </li>
                            ))}
                        </ul>))}
                </div>
            </div>
        );
    }
}

DropdownNav.defaultProps = {
    classicDpd: false,
    elements: [],
    placeholder: "Select an item",
    selector: false,
};

export default DropdownNav;
