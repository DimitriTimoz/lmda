import React from "react";
import { ALL } from "../../data";
import "./HamburgerMenu.css";
import DropdownNav from "../DropdownNav";

export default class HamburgerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFilter: "",
        };

        this.increment = this.increment.bind(this);
        this.back = this.back.bind(this);
    }

    back = () => {
        let filter = this.state.currentFilter.split(":").slice(0, -1).join(":");

        this.setState({ currentFilter: filter});
    }

    increment = (filter) => {
        let currentFilter = this.state.currentFilter;
        if (currentFilter !== "") {
            currentFilter += ":";
        }
        currentFilter += filter;
        this.setState({ currentFilter: currentFilter.toLowerCase()});
    }

    render() {
        let filters = DropdownNav.getFilters(ALL);
        filters = DropdownNav.getAllMatchingFilters(filters, this.state.currentFilter);
        let added = [];
        return (
            <div>
                {filters.map((filter) => {
                    filter = filter.split(":");
                    filter = filter[0];
                    let filterName = filter.split("-").join(" ");
                    filterName = filterName[0].toUpperCase() + filterName.slice(1);
                    if (added.includes(filter)) {
                        return <></>;
                    }
                    added.push(filter);
                    return (
                        <span onClick={async () => {this.increment(filter)}}>{filterName}</span>
                    );
                })}
            </div>
        );
    }
}
