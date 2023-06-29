import React from "react";  

import "./Radio.css";

export default class Radio extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {checked: false};
    }

    render() {
        return (
            <input name={this.props.name} 
                    value={this.props.value} 
                    type="radio" 
                    className="radio" 
                    checked={this.state.checked} 
                    onChange={(e) => {
                        this.setState({checked: !this.state.checked});
                        this.props.onChange(e);
                    }} />
        )
    }
}