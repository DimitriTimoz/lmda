import {Component, useEffect} from 'react';
import Button from '../components/Button';
import Radio from '../components/Radio';
import RawPreview from '../components/products/RawPreview';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'
import axios from 'axios';

import "./Cart.css"
class Cart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            deliverySystem: 0,
            secret: "",
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
        this.changeDeliverySystem = this.changeDeliverySystem.bind(this);
        this.submit = this.submit.bind(this);
    }

    changeDeliverySystem = (e) => {
        this.setState({
            deliverySystem: parseInt(e.target.value),
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

        this.setState({
            products: products,
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
        let products_ids = [];
        products.forEach((product) => {
            products_ids.push(product.id);
        });

        let address = "temp adress";
        let email = "temp.email@example.com";
        let phone = "0123456789";
        // Send the order to the server
        let body = {
            products: products_ids,
            delivery: {
                address: address,
            },
            phone: phone,
            email: email,
        };
            // Create PaymentIntent as soon as the page loads
        axios.post("/api/payement/create-payment-intent", body)
            .then((res) => {
                this.setState({secret: res.data.clientSecret})
            });
          
        /*axios.post('/api/order', body)
            .then((res) => {
                // If the order was created successfully
                // Clear the cart
                if (res.status === 201) {
                    localStorage.removeItem("cart");
                }
                // Redirect to the order page
                window.location.href = "/order/" + res.data.id;
            }
        );*/
    }
    
    render() {
        // Calculate new totals
        let productsTotal = 0;
        let massTotal = 0;
        this.state.products.forEach((product) => {
            productsTotal += product.prices[0];
            if (this.state.deliverySystem > 0) {
                massTotal += product.mass
            }

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
                        <table className='delivery-kinds'>
                            <tr className='delivery-kind'>
                                <td style={{ width: '20%' }}>
                                <img src="/icons/home.svg" alt="Home" />
                                </td>
                                <td style={{ width: '60%' }}>
                                À domicile
                                </td>
                                <td style={{ width: '20%' }}>
                                <Radio name="delivery-system" 
                                    value="0" 
                                    checked={this.state.deliverySystem === 0}
                                    onChange={this.changeDeliverySystem} />
                                </td>
                            </tr>
                            <tr className='delivery-kind'>
                                <td style={{ width: '20%' }}>
                                <img src="/icons/pin.svg" alt="Point relais" />
                                </td>
                                <td style={{ width: '60%' }}>
                                En point relais
                                </td>
                                <td style={{ width: '20%' }}>
                                <Radio name="delivery-system" 
                                    value="1" 
                                    checked={this.state.deliverySystem === 1}
                                    onChange={this.changeDeliverySystem} />
                                </td>
                            </tr>
                        </table>
                    </div>
                    {this.state.deliverySystem > 0 &&
                        <div className='cart-adress'>
                            <h3>Adresse</h3>
                            <Button title="Ajouter" className={""} />
                        </div>
                    }
                </div>
                <div className='cart-summary'>
                    <h4>Résumé de votre commande</h4>
                    <table className='summary'>
                        <tr>
                            <td>Commande</td>
                            <td>{productsTotal} €</td>
                        </tr>
                        <tr>
                            <td>Frais de port</td>
                            <td>{massTotal} €</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{total} €</td>
                        </tr>
                    </table>
                    {clientSecret && this.props.stripePromise && (
                        <Elements stripe={this.props.stripePromise} options={{ clientSecret }}>
                            <CheckoutForm />
                        </Elements>
                    )}

                    <Button title="Payer" className={"valid-button"} onClick={this.submit} />
                </div>
            </div>
        );
    }
}

export default Cart;