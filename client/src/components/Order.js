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
        
        return (this.props ?
            <div id="order">
            <div className="column">
                <h2>Nom Prénom</h2>
                <h3>Adresse</h3>
                <h3>Code postal</h3>
                <h3>Ville</h3>
                <h3>Pays</h3>
                <h3>Téléphone</h3>
                <h3>Email</h3>
                <Button tittle="Obtenir Bordereau" />
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
                <Button tittle="Marquer comme expédiée" onClick={this.shipOrder.bind(this)} />
            </div>
        </div>
        :
        <p>Chargement...</p>  
        );
    }
}
