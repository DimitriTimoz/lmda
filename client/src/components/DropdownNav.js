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
            selection: "",
        };
        this.filter_level = 1;
        this.dropdownRef = React.createRef();
        this.filters = ""; 
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
                    value: this.filters
                }
            });
        }
    }

    incrementFilter = (e) => {
        e.preventDefault();
        let level = parseInt(e.target.getAttribute("level"));
        let filter = e.target.innerText;
        this.filter_level = level + 1;
        this.filters = this.filters.split(":").slice(0, level - 1).join(":");

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

    trigger = () => {
        this.setState((prevState) => ({
            active: !prevState.active,
            selection: prevState.active ? "" : this.state.selection,
        }));
    }

    getList() {
        return DropdownNav.get_filters(this.props.elements, "", this.props.classicDpd);
    }

    getFiltersAtLevel(level) {
        const filters = this.filters.split(":");
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

    getAllMatchingFilters() {
        let items = [];
        const list = this.getList();
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

    render() {
        const { active, selection } = this.state;
        const range = [...Array(this.filter_level).keys()];
        const filters = range.map((i) => {
            const [items, prefilter] = this.getFiltersAtLevel(i + 1);
            return [i + 1, items, prefilter];
        });

        return (
            <div ref={this.dropdownRef} className="dropdown-menu">
                <div className='dropdown-selector' onClick={this.trigger}>
                    <span className={active ? 'selected-item-dp active' : 'selected-item-dp'}>{this.props.placeholder}</span>
                    <img alt="arrow" className={active ? 'arrow rotate' : 'arrow'} src='/icons/arrow.svg' />
                </div>
                <div className={active ? 'dp-category' : 'dp-category hide'}>
                    {filters.map(([level, items, prefilter]) => (items.length > 0 &&
                        <ul className="dp-elements" key={level}>
                            {!this.props.selector && <li>
                                <Link to={"/products/" + this.props.category + "/" + (level === 0 ? "all" : prefilter.toLocaleLowerCase().replace(" ", "-"))}>Tout</Link>
                            </li>}
                            {items.map((element) => (
                                <li key={element} className='dp-element'>
                                    <div level={level} onClick={this.incrementFilter} className="dropdown-link">
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

DropdownNav.defaultProps = {
    classicDpd: false,
    elements: [],
    placeholder: "Select an item",
    selector: false,
};

export default DropdownNav;
