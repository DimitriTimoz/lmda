import React from "react";

import "./Input.css";

export default class Input extends React.Component {
    render() {
        let type = this.props.type || "text";
        let required = this.props.required || false;
        return (
            <input required={required} className="input" type={type} placeholder={this.props.placeholder} value={this.props.value} name={this.props.name} onChange={(event) => this.props.onChange(event)} />
        )   
    }
}