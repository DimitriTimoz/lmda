import React from "react";
import Button from "../components/Button";
import LikeBtn from "../components/LikeBtn";
import ImageCarrousel from "../components/products/ImageCarrousel";
import "./Product.css";

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}

export default class Product extends React.Component {
    constructor(props) {
        super(props); 

        // Get the product from the local storage
        let product_id = window.location.pathname.split("/")[2];
        if (isNaN(product_id)) {
            window.location.href = "/";
        }
        product_id = parseInt(product_id);
        const products = localStorage.getItem("products");
        if (products) {
            this.product = JSON.parse(products).find(
                (p) => p.id === product_id
            );
            console.log(this.product);
        } else {
            this.product = null;
        }

        // Check if the product is in the cart
        let in_cart = false;
        const cart = localStorage.getItem("cart");
        if (cart) {
            const cartItems = JSON.parse(cart);
            // If is in set in_cart to true
            if (cartItems.find((p) => p.id === product_id)) {
                in_cart = true;
            }
        }
        this.addTocart = this.addTocart.bind(this);
        this.viewCart = this.viewCart.bind(this);

        this.state = {
            in_cart: in_cart,
        };
    }

    viewCart() {
        window.location.href = "/cart";
    }

    addTocart() {
        const cart = localStorage.getItem("cart");
        if (this.product) {
            if (cart) {
                const cartItems = JSON.parse(cart);
                // Check if the product is already in the cart
                if (cartItems.find((p) => p.id === this.product.id)) {
                    return;
                }
                cartItems.push(this.product);
                localStorage.setItem("cart", JSON.stringify(cartItems));
            } else {
                localStorage.setItem("cart", JSON.stringify([this.product]));
            }
            this.setState({ in_cart: true });
        }
    }
    

    render() {
        if (!this.product) {
            // TODO: Get the product from the API
            return <div>Produit introuvable</div>;
        }
        let photos = this.product.photos.slice(1);
        let photos_paths = photos.map((photo) => {
            return '/uploads/' + photo;
        });
        return (
            <div>
                <div className="product">
                    <ImageCarrousel enable={true} photos={photos_paths}/>
                    <div className="product-block">
                        <div>
                            <h2>{this.product.name}</h2>
                            <span className="price">{parseFloat(this.product.prices[0])/100} €</span>
                            <span className="product-description">
                                {this.product.description}
                            </span>
                        </div>
                        <div>
                            {this.state.in_cart ? 
                                <Button title="Voir mon pannier" className="" onClick={this.viewCart} />
                                : 
                                <Button title="Acheter" className="" onClick={this.addTocart} />}
                            
                            <LikeBtn pid={this.product.id} className="product-like" />
                            <table className="product-details">
                                <tr>
                                    <td>TAILLE</td>
                                    <td>{this.product.size}</td>
                                </tr>
                                <tr>
                                    <td>ÉTAT</td>
                                    <td>{this.product.state}</td>
                                </tr>
                                <tr>
                                    <td>Date d'ajout</td>
                                    <td>{formatDate(this.product.date)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}