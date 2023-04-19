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
                className={`like-btn'`}
                onClick={() => this.trigger()}
            >
                <img src="/icons/heart.svg" alt="heart" className={this.state.active ? "heart-active" : ""} />
            </button>
        );
    }
}