import React from "react";
import "./RawPreview.css";
import TxtButton from "../TxtButton";
import axios from "axios";

export default class RawPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order_mode: this.props.order || false,
            product: this.props.product,
            edit: this.props.edit || false,
            cancel_order: this.props.cancelOrder || false,
            deliver: this.props.deliver || false,
        };

        this.removeFormCart = this.removeFormCart.bind(this);
        this.removeAction = this.removeAction.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
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
                if (cartItems.find((p) => p.id === this.state.product.id)) {
                    cartItems.splice(cartItems.indexOf(this.state.product), 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                }
            }
        }
    }

    cancelOrder() {
        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment annuler cette commande ?")) {
            // Remove from database
            axios.delete("/api/order/" + this.props.product.id).then((res) => {
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
        if (!this.state.product && !this.props.order) {
            return null;
        }
        return (
            <div className="raw-preview">
                {this.props.order ?
                    <img className="raw-preview-image"/>
                :
                    <img src={"/uploads/" + this.state.product.photos[0]} alt={this.state.product.name} className="raw-preview-image"/>
                }
                <div className="raw-preview-left">
                    {this.props.order ?
                        <h4 className="p-name" >{"Nom Prénom"}</h4>
                    :
                        <h4 className="p-name" >{this.state.product.name}</h4>
                    }
                    {this.props.order ?
                        <span className="p-details" >{this.props.order.products.length + " Produit(s)"}</span>
                        :
                        <span className="p-details" >{this.state.product.size + " - " + this.state.product.state}</span>
                    }
                    <div className="buttons">
                        {this.state.edit ? <TxtButton title="Modifier" className="view-button" onClick={() => {window.location.href = "/admin/edit/" + this.state.product.id}} /> : null}
                        {this.state.cancel_order ? <TxtButton title="Annuler" className="view-button" onClick={this.cancelOrder} /> : null}
                        <TxtButton title="Supprimer" className="view-button" onClick={this.removeAction} />
                    </div>
                </div>
                {this.props.order ?
                    <span className="price" >{parseFloat(this.props.order.amount / 100)}&nbsp;€</span>
                :
                    <span className="price" >{parseFloat(this.state.product.prices[0])/100}&nbsp;€</span>
                }
            </div>
        );
    }
}