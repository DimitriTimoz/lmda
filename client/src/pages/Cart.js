import {Component} from 'react';
import Button from '../components/Button';
import RawPreview from '../components/products/RawPreview';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'
import axios from 'axios';

import "./Cart.css"
import ErrorPopup from '../components/ErrorPopup';
import AddressForm from '../components/AddressForm';
class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            secret: "",
            opennedRelay: false,
            opennedAddress: false,
            email: "",
            error: "",
            address: {
                firstName: "",
                lastName: "",
                address1: "",
                address2: "",
                city: "",
                zipCode: "",
                country: "",
            },
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
        this.submit = this.submit.bind(this);
        this.triggerDeliveryMenu = this.triggerDeliveryMenu.bind(this);
        this.triggerAddressMenu = this.triggerAddressMenu.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setAddress = this.setAddress.bind(this);
    }

    setEmail = (email) => {
        this.setState({
            email: email,
        });
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
        let confirmed = [];
        // Check if the product is available
        products.forEach((product) => {
            axios.get("/api/product/" + product)
            .then((res) => {
                if (res.status === 200) {
                    // Check if the product is still available
                    if (!res.data.ordered) {
                        confirmed.push(res.data);
                        // Save the products in the local storage
                        localStorage.setItem("cart", JSON.stringify(confirmed.map((product) => product.id)));

                        this.setState({
                            products: confirmed,
                        });
                    } 
                } else {
                    this.setState({
                        error: res.data.message,
                    });
                }
            }).catch((err) => {
                this.setState({
                    error: err.response.data.message,
                });
            });
        });
        
        if (products.length === 0) {
            this.setState({
                products: [],
            });
        }
    }

    triggerDeliveryMenu = () => {
        if (this.state.opennedAddress) {
            return;
        }

        if (this.state.products.length === 0) {
            return;
        }

        this.setState({
            opennedRelay: !this.state.opennedRelay,
        });
    }

    triggerAddressMenu = () => {
        if (this.state.opennedRelay) {
            return;
        }

        if (this.state.products.length === 0) {
            return;
        }

        this.setState({
            opennedAddress: !this.state.opennedAddress,
        });
    }
    
    submit = () => {
        // Get the products from the local storage in the cart
        const cart = localStorage.getItem("cart");
        let products = [];
        if (cart) {
            products = JSON.parse(cart);
        }

        // Get the IDs of the products
        let address = "temp adress";
        let phone = "0123456789";
        // Send the order to the server
        let body = {
            name: "Foo Bar", 
            products: products,
            delivery: {
                address: address,
            },
            phone: phone,
            email: this.state.email,
        };
        // Create PaymentIntent as soon as the page loads
        axios.post("/api/payment/create-payment-intent", body)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({secret: res.data.clientSecret})
                } else {
                    this.setState({error: res.data.message})
                }
            }).catch((err) => {
                err = err.response.data.message;
                this.setState({error: "Une erreur est survenue lors de la création de la commande: " + err});
            });
    }

    setAddress = (address) => {
        this.setState({
            address: address,
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

        if (this.state.opennedRelay) {
            if (!document.getElementById("relay-script")) {
                let script = document.createElement("script");
                script.id = "relay-script";
                script.src = "/scripts/ralay.js";
                script.async = true;
            
                document.getElementsByTagName("head")[0].appendChild(script);    
            }
        } else {
            if (document.getElementById("relay-script")) {
                document.getElementById("relay-script").remove();
            }
        }

        return (
            <div className="cart">
                <div className='cart-details'>
                    <div className='cart-products'>
                        <h3>Commande</h3> 
                        {this.state.products.map((product) => (
                            <RawPreview cart={true} product={product} onChange={this.handleProductUpdate}/>
                        ))}
                        {this.state.products.length === 0 &&
                            <span>Votre panier est vide</span>
                        }

                    </div>
                    <div className='address'>
                        <h3>Adresse</h3>
                        {this.state.opennedAddress &&
                            <div className='relay-popup shadow'>
                                <AddressForm address={this.state.address} setAddress={this.setAddress}/>
                                <Button title="Confirmer" onClick={this.triggerAddressMenu} />
                            </div>
                        }
                        <Button title="Ajouter" onClick={this.triggerAddressMenu} />

                    </div>
                    <div className='cart-delivery'>
                        <h3>Point Relay</h3>
                        {this.state.opennedRelay &&
                            <div className='relay-popup shadow'>
                                <div id="Zone_Widget"></div>
                                <Button title="Confirmer" onClick={this.triggerDeliveryMenu} />
                            </div>
                        }
                        <Button title="Ajouter" onClick={this.triggerDeliveryMenu} />
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
                            <CheckoutForm setEmail={this.setEmail} />
                        </Elements>
                    )}

                    <Button title="Payer" className={"valid-button"} onClick={this.submit} />
                </div>}
                <input type="hidden" id="ParcelShopCode" name="ParcelShopCode" />

                {this.state.error.length > 0 && <ErrorPopup error={this.state.error} onClose={() => {window.location.reload(); this.setState({error: ""})}} />}
            </div>
        );
    }
}

export default Cart;
