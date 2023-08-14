import React from "react";
import "./Dashboard.css";
import axios from "axios";
import RawPreview from "../../components/products/RawPreview";
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products_insell: [],
            orders_paid: [],
            orders_shipped: [],
        };
        
        this.updateProducts = this.updateProducts.bind(this);
    }

    componentDidMount() {
        this.updateProducts();
    }

    updateProducts = () => {
        // Fetch all products
        axios.get("/api/products/all/all").then((res) => {
            let products = res.data.products;
            this.setState({ products_insell: products,
            });
        });

        // Fetch all orders
        axios.get("/api/order/all").then((res) => {
            let orders = res.data.orders;
            // Get ordrered products
            let orders_paid = orders.filter((order) => {
                return order.paid;
            });
            // Get shipped products
            let orders_shipped = orders.filter((order) => {
                return order.shipped;
            });
            console.log(orders_paid);
            console.log(orders_shipped);
            this.setState({ 
                        orders_paid: orders_paid,
                        orders_shipped: orders_shipped    
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
                    <h3>Commandes en attente</h3>
                    {this.state.orders_paid.map((order) => {
                        return <RawPreview order={order} cancelOrder={true} admin={true} onChange={this.updateProducts}/>;
                    })}
                </div>
                <div className="column">
                    <h3>Commandes expédiés</h3>
                    {this.state.orders_shipped.map((order) => {
                        return <RawPreview order={order} edit={false} onChange={this.updateProducts}/>;
                    })}
                </div>
                <div className="column">
                    <h3>Recherche</h3>
                </div>
            </div>
        )
    }
}