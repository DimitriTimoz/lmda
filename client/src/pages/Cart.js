import React from 'react';
import Button from '../components/Button';
import Radio from '../components/Radio';
import RawPreview from '../components/products/RawPreview';
import "./Cart.css"

class Cart extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            products: [],
            total: 0,
            productsTotal: 0,
            deliveryTotal: 0,
            deliverySystem: 0,
        };
        
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
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
        // Calculate new totals
        let productsTotal = 0;
        let deliveryTotal = 0;

        products.forEach((product) => {
            total += product.prices[0];
            productsTotal += product.prices[0];
            if (this.state.deliverySystem > 0) {
                deliveryTotal += product.prices[this.state.deliverySystem];
            }

        });

        this.setState({
            products: products,
            total: total + deliveryTotal,
            productsTotal: productsTotal,
            deliveryTotal: deliveryTotal,
        });
    }
    
    render() {
        
        return (
            <div className="cart">
                <div className='cart-details'>
                    <div className='cart-products'>
                        <h3>Commande</h3> 
                        {this.state.products.map((product) => (
                            <RawPreview product={product} onChange={this.handleProductUpdate}/>
                        ))}

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
                                <Radio/>
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
                                <Radio/>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='cart-adress'>
                        <h3>Adresse</h3>
                        <Button title="Ajouter" className={""} />

                    </div>
                    <div className='cart-payment'>
                        <h3>Paiement</h3>
                        <Button title="Ajouter une méthode de paiment" className={""} />
                    </div>
                </div>
                <div className='cart-summary'>
                    <h4>Résumé de votre commande</h4>
                    <table className='summary'>
                        <tr>
                            <td>Commande</td>
                            <td>{this.state.productsTotal} €</td>
                        </tr>
                        <tr>
                            <td>Frais de port</td>
                            <td>{this.state.deliveryTotal} €</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{this.state.total} €</td>
                        </tr>
                    </table>
                    <Button title="Valider" className={"valid-button"} />
                </div>
            </div>
        );
    }
}

export default Cart;