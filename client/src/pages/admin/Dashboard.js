import React from "react";
import "./Dashboard.css";
import axios from "axios";
import RawPreview from "../../components/products/RawPreview";
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
        // Fetch all products
        axios.get("/api/products/all").then((res) => {
            this.setState({ products: res.data.products });
        });

        
    }

    render() {
        return (
            <div id="dashboard">
                <div className="column">
                    <h3>En vente</h3>
                    {this.state.products.map((product) => {
                        return <RawPreview product={product} edit={true}/>;
                    })}
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