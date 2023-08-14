import {Component} from 'react';
import Button from '../components/Button';
import RawPreview from '../components/products/RawPreview';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'
import axios from 'axios';

import "./Cart.css"
import ErrorPopup from '../components/ErrorPopup';
class Cart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            secret: "",
            error: "",
            openned: false,
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
        this.submit = this.submit.bind(this);
        this.openDeliveryMenu = this.openDeliveryMenu.bind(this);
    }

    throwError = (error) => {
        this.setState({
            error: error,
        });
    }

    componentDidMount() {
        this.handleProductUpdate();    
    }

    handleProductUpdate = () => {
        // Get the products from the local storage in the cart
        const cart = localStorage.getItem("cart");
        let products = [];
        if (cart) {
            products = JSON.parse(cart);
        } 
        // Check if the product is available
        products.forEach((product) => {
            axios.get("/api/product/" + product.id)
            .then((res) => {
                if (res.status === 200) {
                    // Check if the product is still available
                    if (res.data.ordered) {
                        let products = JSON.parse(localStorage.getItem("cart"));
                        let index = products.indexOf(product);
                        products.splice(index, 1);
                        this.setState({
                            products: products,
                        });
                        localStorage.setItem("cart", JSON.stringify(products));
                    }
                }
            }).catch((err) => {
                this.setState({
                    error: err.response.data.message,
                });
            });
        });
    
        this.setState({
            products: products,
        });
    }

    openDeliveryMenu() {
        if (this.state.products.length === 0) {
            console.log("No products in the cart");
            return;
        }

        this.setState({
            openned: true,
        });
        // Load the script for the relay
        const script = document.createElement("script");

        script.src = "/scripts/ralay.js";
        script.async = true;
    
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    
    submit = () => {
        // Get the products from the local storage in the cart
        const cart = localStorage.getItem("cart");
        let products = [];
        if (cart) {
            products = JSON.parse(cart);
        }

        // Get the IDs of the products
        let products_ids = [];
        products.forEach((product) => {
            products_ids.push(product.id);
        });

        let address = "temp adress";
        let email = "temp.email@example.com";
        let phone = "0123456789";
        // Send the order to the server
        let body = {
            name: "Foo Bar", 
            products: products_ids,
            delivery: {
                address: address,
            },
            phone: phone,
            email: email,
        };
        // Create PaymentIntent as soon as the page loads
        axios.post("/api/payment/create-payment-intent", body)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({secret: res.data.clientSecret})
                } else {
                    this.throwError("Une erreur est survenue lors de la création de la commande: " + res.data.message);
                }
            }).catch((err) => {
                err = err.response.data.message;
                this.throwError("Une erreur est survenue lors de la création de la commande: " + err);
            });
    }
    
    render() {
        // Calculate new totals
        let productsTotal = 0;
        let massTotal = 0;
        this.state.products.forEach((product) => {
            productsTotal += product.prices[0];
        });

        const clientSecret = this.state.secret;
        let total = productsTotal + massTotal * 0.01;

        return (
            <div className="cart">
                <div className='cart-details'>
                    <div className='cart-products'>
                        <h3>Commande</h3> 
                        {this.state.products.map((product) => (
                            <RawPreview product={product} onChange={this.handleProductUpdate}/>
                        ))}
                        {this.state.products.length === 0 &&
                            <span>Votre panier est vide</span>
                        }

                    </div>
                    <div className='cart-delivery'>
                        <h3>Livraison</h3>
                        {this.state.openned ?
                            <div id="Zone_Widget"></div>
                            :
                            <Button title="Ajouter" onClick={this.openDeliveryMenu} />
                        }
                    </div>
                </div>
                {total > 0 && <div className='cart-summary'>
                    <h4>Résumé de votre commande</h4>
                    <table className='summary'>
                        <tr>
                            <td>Commande</td>
                            <td>{parseFloat(productsTotal)/100} €</td>
                        </tr>
                        <tr>
                            <td>Frais de port</td>
                            <td>{massTotal} €</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{parseFloat(total)/100} €</td>
                        </tr>
                    </table>
                    {clientSecret && this.props.stripePromise && (
                        <Elements stripe={this.props.stripePromise} options={{ clientSecret }}>
                            <CheckoutForm />
                        </Elements>
                    )}

                    <Button title="Payer" className={"valid-button"} onClick={this.submit} />
                </div>}
                {this.state.error.length > 0 && <ErrorPopup error={this.state.error} onClose={() => {this.setState({error: ""})}} />}
            </div>
        );
    }
}

export default Cart;