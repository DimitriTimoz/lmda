import React from "react";
import "./ErrorPopup.css";
import Button from "./Button";

export default class ErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: props.error,
        };

        this.close = this.close.bind(this);
    }

    close = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        return (
            <div className="error-popup">
                <div className="error-popup-content">
                    <h3>Erreur</h3>
                    <p>{this.state.error}</p>
                    <Button onClick={this.close} title="Fermer"/>
                </div>
            </div>
        );
    }
}