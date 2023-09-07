import React from "react";
import Button from "../components/Button";
import LikeBtn from "../components/LikeBtn";
import ImageCarrousel from "../components/products/ImageCarrousel";
import axios from "axios";
import "./Product.css";
import { toState } from "../utils";

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

        this.state = {
            product: null,
            inCart: false,
        };

        // Get the product from the local storage
        let product_id = window.location.pathname.split("/")[2];
        if (isNaN(product_id)) {
            window.location.href = "/";
        }
        product_id = parseInt(product_id);

        const products = localStorage.getItem("products");

        if (products) {
            let prod = JSON.parse(products).find(
                (p) => p.id === product_id
            );
            
            if (prod) {
                this.state.product = prod;
            } else {
                this.fetchProduct(product_id);
                return;
            }
        } else {
            this.fetchProduct(product_id);
            return;
        }

        // Check if the product is in the cart
        let inCart = false;
        const cart = localStorage.getItem("cart");
        if (cart) {
            const cartItems = JSON.parse(cart);
            // If is in set inCart to true
            if (cartItems.find((p) => p === product_id)) {
                inCart = true;
            }
        }
        this.addToCart = this.addToCart.bind(this);
        this.viewCart = this.viewCart.bind(this);

        this.state.inCart = inCart;
    }

    fetchProduct = (pid) => {
        axios.get('/api/product/' + pid)
            .then(res => {
                if (res.data) {
                    // Check if the product is in the cart
                    let inCart = false;
                    const cart = localStorage.getItem("cart");
                    if (cart) {
                        const cartItems = JSON.parse(cart);
                        // If is in set inCart to true
                        if (cartItems.find((p) => p === pid)) {
                            inCart = true;
                        }
                    }
                    this.setState({product: res.data, inCart: inCart});
                }
            });
    }

    viewCart() {
        window.location.href = "/cart";
    }

    addToCart = () => {
        const cart = localStorage.getItem("cart");
        if (this.state.product) {
            if (cart) {
                const cartItems = JSON.parse(cart);
                // Check if the product is already in the cart
                if (cartItems.find((p) => p === this.state.product.id)) {
                    return;
                }
                cartItems.push(this.state.product.id);
                localStorage.setItem("cart", JSON.stringify(cartItems));
            } else {
                localStorage.setItem("cart", JSON.stringify([this.state.product.id]));
            }
            this.setState({ inCart: true });
        }
    }
    

    render() {
        if (!this.state.product) {
            return <div>Produit introuvable</div>;
        }
        let photos = this.state.product.photos.slice(1);
        let photos_paths = photos.map((photo) => {
            return '/uploads/' + photo;
        });
        return (
            <div>
                <div className="product">
                    <ImageCarrousel enable={true} photos={photos_paths}/>
                    <div className="product-block">
                        <div>
                            <h2>{this.state.product.name}</h2>
                            <span className="price">{parseFloat(this.state.product.prices[0])/100} €</span>
                            <span className="product-description">
                                {this.state.product.description}
                            </span>
                        </div>
                        <div>
                            {this.state.inCart ? 
                                <Button title="Voir mon panier" className="" onClick={this.viewCart} />
                                : 
                                <Button title="Acheter" className="" onClick={this.addToCart} />}
                            
                            <LikeBtn pid={this.state.product.id} className="product-like" />
                            <table className="product-details">
                                <tr>
                                    <td>TAILLE</td>
                                    <td>{this.state.product.size}</td>
                                </tr>
                                <tr>
                                    <td>ÉTAT</td>
                                    <td>{toState(this.state.product.state).toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td>Date d'ajout</td>
                                    <td>{formatDate(this.state.product.date)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}