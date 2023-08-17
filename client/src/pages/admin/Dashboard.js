import React from "react";
import "./Dashboard.css";
import axios from "axios";
import RawPreview from "../../components/products/RawPreview";
import Order from "../../components/Order";
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productsInsell: [],
            ordersPaid: [],
            ordersShipped: [],
            seeMore: false,
            order: null,
        };
        
        this.updateProducts = this.updateProducts.bind(this);
        this.closeSeeMore = this.closeSeeMore.bind(this);
    }   

    closeSeeMore = () => {
        this.setState({
            seeMore: false,
        });
    }

    seeMore = (order) => {
        this.setState({
            seeMore: true,
            order: order,
        });
    }
    
    componentDidMount = () => {
        this.updateProducts();
    }

    updateProducts = () => {
        // Fetch all products
        axios.get("/api/products/all/all").then((res) => {
            let products = res.data.products;
            this.setState({ productsInsell: products });
        });

        // Fetch all orders
        axios.get("/api/order/all").then((res) => {
            let orders = res.data.orders;
            // Get ordrered products
            let ordersPaid = orders.filter((order) => {
                return order.paid;
            });
            // Get shipped products
            let ordersShipped = orders.filter((order) => {
                return order.shipped;
            });
            this.setState({ 
                    ordersPaid: ordersPaid,
                    ordersShipped: ordersShipped    
            });
        });
    }

    render() {
        return (
            <div>
                <div id="dashboard">
                    <div className="column">
                        <h3>En vente</h3>
                        {this.state.productsInsell.map((product) => {
                            return <RawPreview product={product} edit={true} delete={true} admin={true} onChange={this.updateProducts}/>;
                        })}
                    </div>
                    <div className="column">
                        <h3>Commandes en attente</h3>
                        {this.state.ordersPaid.map((order) => {
                            return <RawPreview order={order} cancelOrder={true} admin={true} onChange={this.updateProducts} onSeeMore={this.seeMore}/>;
                        })}
                    </div>
                    <div className="column">
                        <h3>Commandes expédiés</h3>
                        {this.state.ordersShipped.map((order) => {
                            return <RawPreview order={order} edit={false} onChange={this.updateProducts} onSeeMore={this.seeMore}/>;
                        })}
                    </div>
                    <div className="column">
                        <h3>Recherche</h3>
                    </div>
                </div>
                {this.state.seeMore ? <Order onClose={this.closeSeeMore} order={this.state.order} /> : null}
                
            </div>
        )
    }
}