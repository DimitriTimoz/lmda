import React from "react";
import "./RawPreview.css";
import TxtButton from "../TxtButton";
import axios from "axios";

export default class RawPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            edit: this.props.edit || false,
        };

        this.removeFormCart = this.removeFormCart.bind(this);
        this.removeAction = this.removeAction.bind(this);
    }

    removeAction() {
        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            if (this.props.admin) {
                // Remove from database
                axios.delete("/api/product/" + this.state.product.id).then((res) => {
                    if (res.data.success) {
                        // Remove from the page
                        this.setState({
                            product: null,
                        });
                        this.props.onChange();
                    }
                });
            } else {
                // Remove from cart
                this.removeFormCart();
                this.props.onChange();
            }
        }
    }

    removeFormCart() {
        const cart = localStorage.getItem("cart");
        if (this.state.product) {
            if (cart) {
                const cartItems = JSON.parse(cart);
                // Check if the product is already in the cart
                if (cartItems.find((p) => p.id == this.state.product.id)) {
                    cartItems.splice(cartItems.indexOf(this.state.product), 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                }
            }
        }
    }

    render() {
        return (
            <div className="raw-preview">
                <img src={"/uploads/" + this.state.product.photos[0]} alt={this.state.product.name} className="raw-preview-image"/>
                <div className="raw-preview-left">
                    <h4 className="p-name" >{this.state.product.name}</h4>
                    <span className="p-details" >{this.state.product.size + " - " + this.state.product.state}</span>
                    <div className="buttons">
                        {this.state.edit ? <TxtButton title="Modifier" className="view-button" onClick={() => {window.location.href = "/edit/" + this.state.product.id}} /> : null}
                        <TxtButton title="Supprimer" className="view-button" onClick={this.removeAction} />
                    </div>
                </div>
                <span className="price" >{this.state.product.prices[0]}&nbsp;€</span>
            </div>
        );
    }
}