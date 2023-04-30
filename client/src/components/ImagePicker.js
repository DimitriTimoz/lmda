import React from "react";
import "./ImagePicker.css";

export default class ImagePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.props.value = "";
    }

    render() {
        return (
            <div className="image-picker">
                <img src={this.props.value || "/icons/image.svg"} alt="image"/>
                <input type="file" accept="image/*" onChange={this.props.onChange}/>
            </div>
        );
    }
}