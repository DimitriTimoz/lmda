import React from "react";
import { ALL } from "../../data";
import "./HamburgerMenu.css";
import DropdownNav from "../DropdownNav";
import { Link } from "react-router-dom";
import { countOccurrences, trimMatchesFromEnd } from "../../utils";


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
        let allLevelLink = "/products/" + (this.state.currentFilter.length > 0 ? this.state.currentFilter.split(":")[0] + "/" + (countOccurrences(this.state.currentFilter) > 1  ? this.state.currentFilter.split(":").slice(1).join(":") : "all") : "all/all");
        let levelLink = trimMatchesFromEnd(allLevelLink, "all");

        let added = [];
        return (
            <div id="hambuger-menu">
                <style>
                    {`body {
                        overflow: hidden;
                    }`}
                </style>
                {this.state.currentFilter.length > 0 && <Link className="menu-el" onClick={this.props.onClose} to={allLevelLink}>Tout</Link>}

                {filters.map((filter) => {
                    filter = filter.split(":");
                    let lastLevel = filter.length === 1;
                    let filterName = filter[0].split("-").join(" ");
                    filter = filter[0].toLowerCase().split(" ").join("-");
                    filterName = filterName[0].toUpperCase() + filterName.slice(1);
                    if (added.includes(filter)) {
                        return <></>;
                    }
                    added.push(filter);
                    return (
                        lastLevel ?
                        <Link className="menu-el" onClick={this.props.onClose} to={trimMatchesFromEnd(levelLink + ":" + filter) }>{filterName}</Link>
                        :
                        <span className="menu-el" onClick={async () => {this.increment(filter)}}>{filterName + " >"}</span>
                    );
                })}
            </div>
        );
    }
}
