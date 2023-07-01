import React from "react";
import "./Dashboard.css";
import axios from "axios";
import RawPreview from "../../components/products/RawPreview";
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products_insell: [],
            products_ordered: [],
            products_shipped: [],
        };
        
        this.updateProducts = this.updateProducts.bind(this);
    }

    componentDidMount() {
        this.updateProducts();
    }

    updateProducts = () => {
        // Fetch all products
        axios.get("/api/products/admin/all/all").then((res) => {
            let products = res.data.products;
            // Get ordrered products
            let products_ordered = products.filter((product) => {
                return product.ordered;
            });
            // Get shipped products
            let products_shipped = products.filter((product) => {
                return product.shipped;
            });
            // Get products in sell
            let products_insell = products.filter((product) => {
                return !product.ordered && !product.shipped;
            }); 
            this.setState({ products_insell: products_insell,
                        products_ordered: products_ordered,
                        products_shipped: products_shipped    
            });
        });
    }

    render() {
        return (
            <div id="dashboard">
                <div className="column">
                    <h3>En vente</h3>
                    {this.state.products_insell.map((product) => {
                        return <RawPreview product={product} edit={true} admin={true} onChange={this.updateProducts}/>;
                    })}
                </div>
                <div className="column">
                    <h3>Commandés</h3>
                    {this.state.products_ordered.map((product) => {
                        return <RawPreview product={product} edit={false} onChange={this.updateProducts}/>;
                    })}
                </div>
                <div className="column">
                    <h3>Expédiés</h3>
                    {this.state.products_shipped.map((product) => {
                        return <RawPreview product={product} edit={false} onChange={this.updateProducts}/>;
                    })}
                </div>
                <div className="column">
                    <h3>Recherche</h3>
                </div>
            </div>
        )
    }
}