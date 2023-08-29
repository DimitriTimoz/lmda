import React from "react";
import "./Dashboard.css";
import axios from "axios";
import RawPreview from "../../components/products/RawPreview";
import Order from "../../components/Order";
import DropdownNav from "../../components/DropdownNav";
import { CAREGORIES_HOMMES, CAREGORIES_ENFANTS, CAREGORIES_FEMMES } from "../../data";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productsInsell: [],
            ordersPaid: [],
            ordersShipped: [],
            seeMore: false,
            order: null,
            category: "homme",
            specifyCategory: "all",
            oid: ""
        };
        
        this.updateProducts = this.updateProducts.bind(this);
        this.closeSeeMore = this.closeSeeMore.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
        axios.get("/api/products/"+ this.state.category + "/" + this.state.specifyCategory).then((res) => {
            let products = res.data.products;
            this.setState({ productsInsell: products });
        });

        console.log(this.state.oid);
        if (this.state.oid.length > 0 && !isNaN(this.state.oid)) {
            axios.get("/api/order/" + this.state.oid).then((res) => {
                let order = res.data.order;
                
                if (order.paid && order.status === 0) {
                    this.setState({ 
                        ordersPaid: [order],
                    });
                } else if (order.status > 0) {
                    this.setState({ ordersShipped: [order] });
                }
            });
        } else {
            // Fetch all orders
            axios.get("/api/order/all").then((res) => {
                let orders = res.data.orders;
                // Get ordrered products
                let ordersPaid = orders.filter((order) => {
                    return order.paid && order.status === 0;
                });
                // Get shipped products
                let ordersShipped = orders.filter((order) => {
                    return order.status > 0;
                });
                this.setState({ 
                    ordersPaid: ordersPaid,
                    ordersShipped: ordersShipped    
                });
            });
        }   
    }
        
    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    render() {
        let categories = {
            "homme" : CAREGORIES_HOMMES,
            "femme" : CAREGORIES_FEMMES,
            "enfant" : CAREGORIES_ENFANTS,
        };
    
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
                            return <RawPreview order={order} cancel={true} admin={true} onChange={this.updateProducts} onSeeMore={this.seeMore}/>;
                        })}
                    </div>
                    <div className="column">
                        <h3>Commandes expédiés</h3>
                        {this.state.ordersShipped.map((order) => {
                            return <RawPreview order={order} edit={false} admin={false} delete={false} cancel={false} onSeeMore={this.seeMore}/>;
                        })}
                    </div>
                    <div className="column seach-col">
                        <h3>Recherche</h3>
                        <select className="select-container select-dropdown" name="category" id="category" value={this.state.category} onChange={this.handleInputChange} >
                            <option value="homme">homme</option>
                            <option value="femme">femme</option>
                            <option value="enfant">enfant</option>
                        </select>
                        <Input type="text" name="oid" placeholder="Identifiant Commande" onChange={this.handleInputChange} value={this.state.oid} />
                        <DropdownNav custom={"no-overflow"} placeholder={this.state.category} selector={true} name="specifyCategory" onChange={this.handleInputChange} elements={categories[this.state.category]} />
                        <Button onClick={this.updateProducts} title="Rechercher" />
                    </div>
                </div>
                {this.state.seeMore ? <Order onClose={this.closeSeeMore} order={this.state.order} onChange={this.updateProducts}  /> : null}
            </div>
        )
    }
}