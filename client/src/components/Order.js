import React from "react";
import "./Order.css";
import axios from "axios";
import RawPreview from "./products/RawPreview";
import Button from "./Button";
import ErrorPopup from "./ErrorPopup";
export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            user: null,
            errorMessages: [],
        };

        if (props.order) {
            this.fetchProducts();
            this.fetchUser();
        }

        this.shipOrder = this.shipOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }

    cancelOrder = () => {
        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment annuler cette commande ?")) {
            // Cancel order
            axios.put("/api/order/" + this.state.product.id, { paid: false }).then((res) => {
                if (res.data.success) {
                    // Remove from the page
                    this.setState({
                        product: null,
                    });
                    this.props.onChange();
                }
            });
        }
    }

    shipOrder = () => {
        if (!this.props.order) {
            console.log("No order");
            return;
        }

        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment marquer cette commande comme expédiée ?")) {
            axios.put("/api/order/" + this.props.order.id, { shipped: true }).then((res) => {
                if (res.data.success) {
                    // Remove from the page
                    this.props.onChange();
                }
            });
        }
    }

    fetchProducts = () => {
        // Fetch the products
        for (let i = 0; i < this.props.order.products.length; i++) {
            axios.get("/api/product/" + this.props.order.products[i]).then((res) => {
                if (res.status === 200) {
                    this.setState({
                        products: [...this.state.products, res.data],
                    });
                }
            }).catch((err) => {
                this.setState({
                    errorMessages: [...this.state.errorMessages, err.response.data.message],
                });
            });
        }
    }

    fetchUser = () => {
        // Fetch the user
        axios.get("/api/user/" + this.props.order.user_id).then((res) => {
            if (res.status === 200) {
                let user = res.data;
                this.setState({
                    user: res.data,
                });
            }
        }).catch((err) => {
            this.setState({
                errorMessages: [...this.state.errorMessages, err.response.data.message],
            });
        });
    }

    getBordereau = () => {
    }

    render() {
        // A popup element to display the order details        
        const user = this.state.user;
        const order = this.props.order;
        return (
            <div id="order">
                {this.state.errorMessages.length > 0 ?
                    <ErrorPopup
                        messages={this.state.errorMessages.join("\n")}
                        onClose={() => this.setState({ errorMessages: [] })}
                    />
                : null
                }
                <span className="close-btn" onClick={this.props.onClose}>Fermer</span>
            {this.props.order ?
                <>
                {this.state.user ? 
                    <div className="column">
                        <h2>{user.name}</h2>
                        {order.address && <p>{order.address.address1}</p>}
                        {order.address && <p>{order.address.address2}</p>}
                        {order.address && <p>{order.address.zipCode + " " + order.address.city}</p>}
                        {order.address && <p>{order.address.country}</p>}
                        <p>{user.phone}</p>
                        <p>{user.email}</p>
                        <Button title="Obtenir bordereau" onClick={this.getBordereau} />
                    </div>
                :
                    <div className="column">
                        <h2>Nom Prénom</h2>
                        <p>Adresse</p>
                        <p>Code postal</p>
                        <p>Ville</p>
                        <p>Pays</p>
                        <p>Téléphone</p>
                        <p>Email</p>
                    </div>
                }
                
                <div className="column">
                    <h2>Produits</h2>
                    {this.state.products.length > 0 ?
                        <div className="product-list">
                            {this.state.products.map((product) => {
                                return (<RawPreview
                                    product={product}
                                />);
                            })}
                        </div>
                    :
                        <div className="product-list">
                            <p>Chargement...</p>
                        </div>
                    }
                    <Button title="Marquer comme expédiée" onClick={this.shipOrder.bind(this)} />
                </div>
            </>
            :
                <p>Chargement...</p>  
            }
        </div>);
    }
}
