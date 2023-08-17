import {Component} from 'react';
import Button from '../components/Button';
import RawPreview from '../components/products/RawPreview';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'
import axios from 'axios';

import "./Cart.css"
import ErrorPopup from '../components/ErrorPopup';
import AddressForm from '../components/AddressForm';
import PersonalForm from '../components/PersonalForm';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            secret: "",
            opennedRelay: false,
            opennedAddress: false,
            opennedInfos: false,
            email: "",
            error: "",
            address: {},
            relay: {},
            infos: {},
            checked: false,
            ordered: false,
            cart: []
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
        this.checkIfOrderIsWaiting = this.checkIfOrderIsWaiting.bind(this);
        this.submit = this.submit.bind(this);
        this.triggerDeliveryMenu = this.triggerDeliveryMenu.bind(this);
        this.triggerAddressMenu = this.triggerAddressMenu.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setInfos = this.setInfos.bind(this);
        this.triggerInfosMenu = this.triggerInfosMenu.bind(this);
    }

    throwError = (error) => {
        this.setState({
            error: error,
        });
    }

    loadState = () => {
        // Load the address if it exists
        const address = localStorage.getItem("address");
        if (address) {
            this.setState({
                address: JSON.parse(address),
            });
        }

        // Load the relay if it exists
        const relay = localStorage.getItem("relay");
        if (relay) {
            this.setState({
                relay: JSON.parse(relay),
            });
        }

        // Load the personal info if it exists
        const infos = localStorage.getItem("infos");
        if (infos) {
            this.setState({
                infos: JSON.parse(infos),
            });
        }
    }

    componentDidMount() {
        this.loadState();
        this.checkIfOrderIsWaiting();    
    }

    handleProductUpdate = () => {
        if (this.state.checked) {
            return;
        }

        // Get the products from the local storage in the cart
        let products = [];
        let cart = localStorage.getItem("cart");
        if (cart) {
            products = JSON.parse(cart);
        } 
        if (this.state.cart.length > 0) {
            products = this.state.cart;
        }

        let confirmed = [];
        // Check if the product is available
        products.forEach((product) => {
            axios.get("/api/product/" + product)
            .then((res) => {
                if (res.status === 200) {
                    // Check if the product is still available
                    if (!res.data.ordered || this.state.ordered) {
                        confirmed.push(res.data);
                        // Save the products in the local storage
                        localStorage.setItem("cart", JSON.stringify(confirmed.map((product) => product.id)));

                        this.setState({
                            products: confirmed,
                        });
                    } 
                } else {
                    this.throwError("Une erreur est survenue lors de la récupération des produits");
                }
            }).catch((err) => {
                this.throwError("Une erreur est survenue lors de la récupération des produits");
            });
        });

        this.setState({
            checked: true,
        });

        if (products.length === 0) {
            this.setState({
                products: [],
            });
        }
    }

    triggerDeliveryMenu = () => {
        if (this.state.opennedAddress || this.state.opennedInfos) {
            return;
        }

        if (this.state.products.length === 0) {
            return;
        }

        if (this.state.opennedRelay && this.state.relay) {
            // Save the relay
            localStorage.setItem("relay", JSON.stringify(this.state.relay));
        }

        this.setState({
            opennedRelay: !this.state.opennedRelay,
        });
    }

    triggerAddressMenu = () => {
        if (this.state.opennedRelay || this.state.opennedInfos) {
            return;
        }

        if (this.state.products.length === 0) {
            return;
        }

        if (this.state.opennedAddress && this.state.address) {
            // Save the address
            localStorage.setItem("address", JSON.stringify(this.state.address));

        }

        this.setState({
            opennedAddress: !this.state.opennedAddress,
        });
    }

    triggerInfosMenu = () => {
        if (this.state.opennedRelay || this.state.opennedAddress) {
            return;
        }

        if (this.state.products.length === 0) {
            return;
        }

        if (this.state.opennedInfos && this.state.infos) {
            // Save the infos
            localStorage.setItem("infos", JSON.stringify(this.state.infos));
        }

        this.setState({
            opennedInfos: !this.state.opennedInfos,
        });
    }
     
    hasFullAddress = () => {
        return this.state.address && this.state.address.address1 && this.state.address.city && this.state.address.zipCode && this.state.address.country && this.state.address.state;
    }

    hasFullInfos = () => {
        return this.state.infos && this.state.infos.name && this.state.infos.email && this.state.infos.tel;
    }
    
    submit = () => {
        // Get the products from the local storage in the cart
        const cart = localStorage.getItem("cart");
        let products = [];
        if (cart) {
            products = JSON.parse(cart);
        }

        // Send the order to the server
        let body = {
            name: this.state.infos.name,
            products: products,
            delivery: {
                address: this.state.address,
            },
            phone: this.state.infos.tel,
            email: this.state.infos.email,
        };
        // Create PaymentIntent as soon as the page loads
        axios.post("/api/payment/create-payment-intent", body)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({secret: res.data.clientSecret})
                    // Save the stripe id
                    localStorage.setItem("stripeId", res.data.clientSecret);
                    localStorage.setItem("orderId", res.data.orderId);
                } else {
                    this.throwError(res.data.message);
                }
            }).catch((err) => {
                err = err.response.data.message;
                this.throwError(err);
            });
    }

    setAddress = (address) => {
        this.setState({
            address: address,
        });
    }

    setInfos = (infos) => {
        this.setState({
            infos: infos,
        });
    }

    checkIfOrderIsWaiting = () => {
        // Get the stripe session id
        const stripeId = localStorage.getItem("stripeId");
        const orderId = localStorage.getItem("orderId");
        if (stripeId && orderId) {
            // Check if the order is waiting
            axios.post("/api/order/get", {id : orderId, paymentIntentId: stripeId.split("_secret")[0]})
            .then((res) => {
                if (res.status === 200) {
                    // Set the current order
                    console.log("setting states");
                    this.setState({
                        cart: res.data.order.products,
                        secret: stripeId,
                        ordered: true,
                    }, this.handleProductUpdate);
                    // Save the cart
                    localStorage.setItem("cart", JSON.stringify(res.data.products.map((id) => id)));

                } else {
                    this.handleProductUpdate();
                }
            }).catch((err) => {
                this.handleProductUpdate();
            });
        } else {
            this.handleProductUpdate();
        }
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
                        <div className='in-cart'>
                            {this.state.products.map((product) => (
                                <RawPreview cart={true} product={product} onChange={this.handleProductUpdate}/>
                            ))}
                            {this.state.products.length === 0 &&
                                <span>Votre panier est vide</span>
                            }
                        </div>
                    </div>
                    <div className='address'>
                        <h3>Adresse</h3>
                        {this.state.opennedAddress &&
                            <div className='address-popup shadow'>
                                <AddressForm address={this.state.address} setAddress={this.setAddress}/>
                                <Button title="Confirmer" className={"popup-confirm"} onClick={this.triggerAddressMenu} />
                            </div>
                        }
                        {this.hasFullAddress() ?
                            <div className='infos-view' onClick={this.triggerAddressMenu}>
                                <span>{this.state.address.address1}</span>
                                <span>{this.state.address.zipCode} {this.state.address.city}</span>
                                <span>{this.state.address.country}</span>
                            </div>
                        :
                            <Button title="Ajouter" onClick={this.triggerAddressMenu} />
                        }                        
                    </div>
                    <div className='cart-delivery'>
                        <h3>Point Relay</h3>
                        {this.state.opennedRelay &&
                            <div className='relay-popup shadow'>
                                <div id="Zone_Widget"></div>
                                <Button title="Confirmer" className={"popup-confirm"} onClick={this.triggerDeliveryMenu} />
                            </div>
                        }
                        <Button title="Ajouter" onClick={this.triggerDeliveryMenu} />
                    </div>
                    <div className='cart-delivery'>
                        <h3>Informations personnelles</h3>
                        {this.state.opennedInfos &&
                            <div className='infos-popup shadow'>
                                <PersonalForm infos={this.state.infos} setInfos={this.setInfos}/>
                                <Button title="Confirmer" className={"popup-confirm"} onClick={this.triggerInfosMenu} />
                            </div>
                        }
                        {this.hasFullInfos() ?
                            <div className='infos-view' onClick={this.triggerInfosMenu}>
                                <span className='bold'>{this.state.infos.name}</span>
                                <span>{this.state.infos.email}</span>
                                <span>{this.state.infos.tel}</span>
                            </div>
                            :
                            <Button title="Ajouter" onClick={this.triggerInfosMenu} />
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
                            <CheckoutForm email={this.state.infos.email} />
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
