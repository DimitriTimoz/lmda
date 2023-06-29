import "./LikeBtn.css";
import React from "react";

export default class LikeBtn extends React.Component {
    constructor(props) {
        super(props);
        // Check if the product is already liked
        let active = false;
        if (this.props.pid) {
            let likes = localStorage.getItem("likes");
            if (likes) {
                likes = JSON.parse(likes);
                if (likes.includes(this.props.pid)) {
                    active = true;
                }
            }
        }
        this.state = {active: active};

    }

    trigger() {
        if (this.props.pid && !this.state.active) {
            // Add it to the local storage
            let likes = localStorage.getItem("likes");
            if (likes) {
                likes = JSON.parse(likes);
                // Check if the product is already liked
                if (likes.includes(this.props.pid)) {
                    return;
                }
                likes.push(this.props.pid);
                localStorage.setItem("likes", JSON.stringify(likes));
            } else {
                localStorage.setItem("likes", JSON.stringify([this.props.pid]));
            }

        } else if (this.props.pid && this.state.active) {
            // Remove it from the local storage
            let likes = localStorage.getItem("likes");
            if (likes) {
                likes = JSON.parse(likes);
                // Check if the product is already liked
                if (!likes.includes(this.props.pid)) {
                    return;
                }
                likes = likes.filter((pid) => pid !== this.props.pid);
                localStorage.setItem("likes", JSON.stringify(likes));
            }
        } else {
            console.error("LikeBtn: No product id provided")
            return;
        }

        this.setState({active: !this.state.active});
    }

    render() {
        
        return (
            <div
                className={`like-btn ${this.props.className ? this.props.className : ""}`}
                onClick={() => this.trigger()}
            >
                <img src={this.state.active ? "/icons/heart-filled.svg" : "/icons/heart.svg"} alt="like btn" className={`heart-img ${this.state.active ? "heart-active" : ""}`} />
            </div>
        );
    }
}