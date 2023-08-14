import React from "react";
import "./Order.css";
import axios from "axios";
import RawPreview from "./products/RawPreview";
import Button from "./Button";

export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };

    }

    cancelOrder() {
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

    shipOrder() {
        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment marquer cette commande comme expédiée ?")) {
            // Cancel order
            axios.put("/api/order/" + this.state.product.id, { shipped: true }).then((res) => {
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

    render() {
        // A popup element to display the order details
        let popup = null;
        
        return (
            <div id="order">
                <span className="close-btn" onClick={this.props.onClose}>Fermer</span>
            {this.props.order ?
                <>
                <div className="column">
                    <h2>Nom Prénom</h2>
                    <p>Adresse</p>
                    <p>Code postal</p>
                    <p>Ville</p>
                    <p>Pays</p>
                    <p>Téléphone</p>
                    <p>Email</p>
                    <Button title="Obtenir bordereau" />
                </div>
                <div className="column">
                    <h2>Produits</h2>
                    <div className="product-list">
                        {this.state.products.map((product) => {
                            <RawPreview
                                key={product.id}
                                product={product}
                                onSeeMore={this.seeMore.bind(this)}
                            />
                        })}
                    </div>
                    <Button title="Marquer comme expédiée" onClick={this.shipOrder.bind(this)} />
                </div>
            </>
            :
                <p>Chargement...</p>  
            }
        </div>);
    }
}
