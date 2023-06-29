import React from "react";
import "./Dashboard.css";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="dashboard">
                <div className="column">
                    <h3>En vente</h3>
                </div>
                <div className="column">
                    <h3>Commandés</h3>
                </div>
                <div className="column">
                    <h3>Expédiés</h3>
                </div>
                <div className="column">
                    <h3>Recherche</h3>
                </div>
            </div>
        )
    }
}