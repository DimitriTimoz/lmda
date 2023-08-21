import React from "react";
import "./RawPreview.css";
import TxtButton from "../TxtButton";
import axios from "axios";
import { toState } from "../../utils";

export default class RawPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: this.props.edit || false,
            order: this.props.order || false,
            cart: this.props.cart || false,
            delete: this.props.delete || false,
            cancel: this.props.cancel || false,
        };

        this.removeFormCart = this.removeFormCart.bind(this);
        this.seeMore = this.seeMore.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
    }

    removeProduct = () => {
        if(!window.confirm("Voulez-vous vraiment supprimer définitivement ce produit ?")) {
            return;
        }
        axios.delete("/api/product/" + this.props.product.id).then((res) => {
            if (res.data.success) {
                this.props.onChange();
            }
        });
    }


    removeFormCart() {
        const cart = localStorage.getItem("cart");
        if (!window.confirm("Voulez-vous vraiment supprimer ce produit du panier ?")) {
            return;
        }

        if (this.props.product) {
            if (cart) {
                const cartItems = JSON.parse(cart);
                // Check if the product is already in the cart
                if (cartItems.find((p) => p === this.props.product.id)) {
                    cartItems.splice(cartItems.indexOf(this.props.product.id), 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    this.props.onChange();
                }
            }
        }
    }

    cancelOrder() {
        // Ask for confirmation
        if (window.confirm("Voulez-vous vraiment annuler cette commande ? Un email sera envoyé à l'utilisateur pour l'en alterter et un remboursement sera effectué. Si vous souhaitez contacter cet utilisateur veuillez concerver ses coordonnées, elles seront supprimés après l'annulation de la commande.")) {
            // Remove from database
            axios.delete("/api/order/" + this.props.order.id).then((res) => {
                if (res.status === 200) {
                    // Remove from the page
                    this.setState({
                        product: null,
                    });
                    this.props.onChange();
                }
            });
        }
    }

    seeMore() {
        if (this.props.onSeeMore) {
            this.props.onSeeMore(this.props.order);
        }
    }

    render() {
        if (!this.props.product && !this.props.order) {
            return null;
        }
        return (
            <div className="raw-preview">
                {this.props.order ?
                    null
                :
                    <img src={"/uploads/" + this.props.product.photos[0]} alt={this.props.product.name} className="raw-preview-image"/>
                }
                <div className="raw-preview-left">
                    {this.props.order ?
                        <h4 className="p-name" >Id: {this.props.order.id}</h4>
                        :
                        <h4 className="p-name" >{this.props.product.name}</h4>
                    }
                    {this.props.order && 
                        <p>{"Le: " + (new Date(this.props.order.created_at)).toLocaleDateString('fr-fr')}</p>
                    }
                    {this.props.order ?
                        <span className="p-details" >{this.props.order.products.length + " Produit(s)"}</span>
                        :
                        <span className="p-details" >{this.props.product.size + " - " + toState(this.props.product.state).toUpperCase()}</span>
                    }
                    <div className="buttons">
                        {this.state.edit ? <TxtButton title="Modifier" className="view-button" onClick={() => {window.location.href = "/admin/edit/" + this.props.product.id}} /> : null}
                        {this.state.cart && <TxtButton title="Supprimer" className="view-button" onClick={this.removeFormCart} /> }
                        {this.state.delete && <TxtButton title="Supprimer" className="view-button" onClick={this.removeProduct} /> }
                        {this.state.order ? <TxtButton title="Voir plus" className="view-button" onClick={this.seeMore} /> : null}
                        {this.state.order && !this.state.cancel ? <TxtButton title="Annuler" className="view-button" onClick={this.cancelOrder} /> : null}
                    </div>
                </div>
                {this.props.order ?
                    <span className="price" >{parseFloat(this.props.order.total)/100}&nbsp;€</span>
                :
                    <span className="price" >{parseFloat(this.props.product.prices[0])/100}&nbsp;€</span>
                }
            </div>
        );
    }
}
