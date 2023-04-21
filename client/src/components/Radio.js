import React from "react";  

import "./Radio.css";

export default class Radio extends React.Component { 
    constructor() {
        super();
        this.state = {checked: false};
    }

    render() {
        return (
            <input type="radio" className="radio" checked={this.state.checked} onChange={() => this.setState({checked: !this.state.checked})} />
        )
    }
}