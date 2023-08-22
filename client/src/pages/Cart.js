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
            opennedDelivery: false,
            opennedAddress: false,
            opennedInfos: false,
            email: "",
            error: "",
            address: {},
            delivery: {},
            infos: {},
            checked: false,
            ordered: false,
            cart: [],
            delivery: {},
            mass: 0,
            productsPrice: 0,
            deliveryPrice: null,
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
        this.checkIfOrderIsWaiting = this.checkIfOrderIsWaiting.bind(this);
        this.submit = this.submit.bind(this);
        this.triggerDeliveryMenu = this.triggerDeliveryMenu.bind(this);
        this.triggerAddressMenu = this.triggerAddressMenu.bind(this);
        this.triggerInfosMenu = this.triggerInfosMenu.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setInfos = this.setInfos.bind(this);
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

        // Load the delivery if it exists
        const delivery = localStorage.getItem("delivery");
        if (delivery) {
            this.setState({
                delivery: JSON.parse(delivery),
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
        let mass = 0;
        let productsPrice = 0;
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
                        mass += res.data.mass;
                        productsPrice += res.data.prices[0];
                        this.setState({
                            products: confirmed,
                            mass: mass,
                            productsPrice: productsPrice,
                        });
                    } 
                } else {
                    this.throwError("Une erreur est survenue lors de la récupération des produits");
                }
            }).catch((err) => {
                if(!err.response) {
                    console.error(err);
                    return;
                }
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

        if (this.state.opennedDelivery) {
            // Set deliveries states
            this.setState({
                delivery: {
                    id: document.getElementById("cb_ID").value,
                    name: document.getElementById("cb_Nom").value,
                    address1: document.getElementById("cb_Adresse1").value,        
                    address2: document.getElementById("cb_Adresse2").value,
                    city: document.getElementById("cb_Ville").value,
                    zipCode: document.getElementById("cb_CP").value,       
                    country: document.getElementById("cb_Pays").value,
                    parcelShopCode: document.getElementById("ParcelShopCode").value,     
                }
            }, function() { 
                if (this.hasFullDelivery()) {
                    localStorage.setItem("delivery", JSON.stringify(this.state.delivery));
                }
            });
        }

        this.setState({
            opennedDelivery: !this.state.opennedDelivery,
        });
    }

    triggerAddressMenu = () => {
        if (this.state.opennedDelivery || this.state.opennedInfos) {
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
        if (this.state.opennedDelivery || this.state.opennedAddress) {
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

    hasFullDelivery = () => {
        return this.state.delivery && this.state.delivery.id && this.state.delivery.name && this.state.delivery.address1 && this.state.delivery.zipCode && this.state.delivery.city && this.state.delivery.country && this.state.delivery.parcelShopCode;
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
            infos: this.state.infos,
            products: products,
            delivery: {
                address: this.state.address,
                delivery: this.state.delivery,
            },
        };
        // Create PaymentIntent as soon as the page loads
        axios.post("/api/payment/create-payment-intent", body)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({secret: res.data.clientSecret, deliveryPrice: res.data.deliveryPrice, mass: res.data.mass})
                    // Save the stripe id
                    localStorage.setItem("stripeId", res.data.clientSecret);
                    localStorage.setItem("orderId", res.data.orderId);
                } else {
                    this.throwError(res.data.message);
                }
            }).catch((err) => {
                if(!err.response) {
                    console.error(err);
                    return;
                }
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
                    // Save the cart
                    localStorage.setItem("cart", JSON.stringify(res.data.order.products));

                    // Set the current order
                    this.setState({
                        cart: res.data.order.products,
                        secret: stripeId,
                        ordered: true,
                    }, this.handleProductUpdate);

                } else {
                    this.handleProductUpdate();
                }
            }).catch((err) => {
                if(!err.response) {
                    console.error(err);
                    return;
                }
                this.handleProductUpdate();
            });
        } else {
            this.handleProductUpdate();
        }
    }

    getDeliveryPrice = (mass, iso) => {
        let isos = [['FR'], ['BE', 'LU'], ['NL'], ['ES', 'PT'], ['DE'], [], ['IT', 'AT']];
        let indexOfCountry = isos.findIndex((element) => element.includes(iso));
        if (mass < 500)
          return [440, 460, 555, 680, 1150, 1290, 1450][indexOfCountry];
        else if (mass < 1000)
          return [490, 540, 605, 720, 1150, 1290, 1450][indexOfCountry];
        else if (mass < 2000)
          return [650, 680, 705, 810, 1290, 1350, 1550][indexOfCountry]; 
        else if (mass < 3000)
          return [705, 750, 830, 950, 1290, 1750, 1790][indexOfCountry];
        else if (mass < 4000)
          return [730, 830, 890, 1050, 1490, 1790, 1850][indexOfCountry];
        else if (mass < 5000)
          return [1150, 1190, 1190, 1140, 1490, 1820, 1990][indexOfCountry];
        else if (mass < 7000)
          return [1390, 1430, 1430, 1360, 1750, 2490, 2550][indexOfCountry];
        else if (mass < 10000)
          return [1490, 1540, 1540, 1640, 2290, 2550, 2590][indexOfCountry];
        else if (mass < 15000)
          return [2190, 2250, 2250, 2190, 2290, 3390, 3390][indexOfCountry];
        else if (mass < 20000)
          return [2490, 2750, 2750, 2890, 3090, 4590, 4590][indexOfCountry];
        else if (mass < 30000)
          return [3090, 3390, 3390, 3590, 3790, 5590, 5590][indexOfCountry];
        else 
          return 999999999;
    }
    
    render() {
        // Calculate new totals
        let productsTotal = 0;
        this.state.products.forEach((product) => {
            productsTotal += product.prices[0];
        });

        const clientSecret = this.state.secret;

        if (this.state.opennedDelivery) {
            if (!document.getElementById("delivery-script")) {
                let script = document.createElement("script");
                script.id = "delivery-script";
                script.src = "/scripts/ralay.js";
                script.async = true;
            
                document.getElementsByTagName("head")[0].appendChild(script);    
            }
        } else {
            if (document.getElementById("delivery-script")) {
                document.getElementById("delivery-script").remove();
            }
        }
        let deliveryPrice;
        if (this.state.deliveryPrice) {
            deliveryPrice = this.state.deliveryPrice;
        } else if (this.state.delivery && this.state.delivery.parcelShopCode && this.state.delivery.parcelShopCode.includes("-")) {
            deliveryPrice = this.getDeliveryPrice(this.state.mass, this.state.delivery.parcelShopCode.split("-")[0]);
        }

        return (
            <div className="cart">
                <div className='cart-details'>
                    <div className='cart-products'>
                        <h3>Commande</h3> 
                        <div className='in-cart'>
                            {this.state.products.map((product) => (
                                <RawPreview cart={true} product={product} onChange={() => window.reload()}/>
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
                        <h3>Point relais</h3>
                        {this.state.opennedDelivery &&
                            <div className='delivery-popup shadow'>
                                <div id="Zone_Widget"></div>
                                <Button title="Confirmer" className={"popup-confirm"} onClick={this.triggerDeliveryMenu} />
                            </div>
                        }
                        {this.hasFullDelivery() ?
                            <div className='infos-view' onClick={this.triggerDeliveryMenu}>
                                <span className='bold'>{this.state.delivery.name}</span>
                                <span>{this.state.delivery.address}</span>
                                <span>{this.state.delivery.zipCode} {this.state.delivery.city}</span>
                                <span>{this.state.delivery.country}</span>
                            </div>
                        :
                            <Button title="Ajouter" onClick={this.triggerDeliveryMenu} />
                        }
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
                {this.state.productsPrice > 0 && <div className='cart-summary'>
                    <h4>Résumé de votre commande</h4>
                    <table className='summary'>
                        <tr>
                            <td>Commande</td>
                            <td>{parseFloat(this.state.productsPrice)/100} €</td>
                        </tr>
                        <tr>
                            <td>Frais de port</td>
                            <td>{parseFloat(deliveryPrice)/100} €</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{parseFloat(this.state.productsPrice + deliveryPrice)/100} €</td>
                        </tr>
                    </table>
                    {clientSecret && this.props.stripePromise && (
                        <Elements stripe={this.props.stripePromise} options={{ clientSecret }}>
                            <CheckoutForm email={this.state.infos.email} />
                        </Elements>
                    )}
                    <Button title="Payer" className={"valid-button"} onClick={this.submit} />
                </div>}
                <input type="hidden" id="ParcelShopCode" name="ParcelShopCode" value={this.state.delivery.parcelShopCode} />
                <input type="hidden" id="cb_ID" name="cb_ID" value={this.state.delivery.ID} />
                <input type="hidden" id="cb_Nom" name="cb_Nom" value={this.state.delivery.name} />
                <input type="hidden" id="cb_Adresse1" name="cb_Adresse1" value={this.state.delivery.address1} />
                <input type="hidden" id="cb_Adresse2" name="cb_Adresse2" value={this.state.delivery.address2} />
                <input type="hidden" id="cb_CP" name="cb_CP" value={this.state.delivery.zipCode} />
                <input type="hidden" id="cb_Ville" name="cb_Ville" value={this.state.delivery.city} />
                <input type="hidden" id="cb_Pays" name="cb_Pays" value={this.state.delivery.country} />
                <input type="hidden" id="mass" name="mass" value={this.state.mass} />
                {this.state.error.length > 0 && <ErrorPopup error={this.state.error} onClose={() => {window.location.reload(); this.setState({error: ""})}} />}
            </div>
        );
    }
}

export default Cart;
