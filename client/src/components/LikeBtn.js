import "./LikeBtn.css";
import React from "react";

export default class LikeBtn extends React.Component {
    constructor() {
        super();
        this.state = {active: false};
    }

    trigger() {
        this.setState({active: !this.state.active});
    }

    render() {
        return (
            <button
                className={`like-btn ${this.props.className ? this.props.className : ""}`}
                onClick={() => this.trigger()}
            >
                <img src={this.state.active ? "/icons/heart-filled.svg" : "/icons/heart.svg"} alt="like btn" className={`heart-img ${this.state.active ? "heart-active" : ""}`} />
            </button>
        );
    }
}