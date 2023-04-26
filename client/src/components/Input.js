import React from "react";

import "./Input.css";

export default class Input extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let type = this.props.type || "text";
        return (
            <input className="input" type={type} placeholder={this.props.placeholder} />
        )   
    }
}