import React from "react";
import "./RawPreview.css";
import TxtButton from "../TxtButton";


export default class RawPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
        };

        this.removeFormCart = this.removeFormCart.bind(this);
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
                    <TxtButton title="Supprimer" className="view-button" onClick={this.removeFormCart} />
                </div>
                <span className="price" >{this.state.product.prices[0]}&nbsp;€</span>
            </div>
        );
    }
}