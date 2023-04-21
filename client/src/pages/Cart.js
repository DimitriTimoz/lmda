import React from 'react';
import Button from '../components/Button';

import "./Cart.css"
import Radio from '../components/Radio';

function Cart() {
    return (
        <div className="cart">
            <div className='cart-details'>
                <div className='cart-products'>
                    <h3>Commande</h3>
 
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

                </div>
                <div className='cart-payment'>
                    <h3>Paiement</h3>

                </div>
            </div>
            <div className='cart-summary'>
                <h4>Récapitulatif</h4>
                <table className='summary'>
                    <tr>
                        <td>Commande</td>
                        <td>0 €</td>
                    </tr>
                    <tr>
                        <td>Frais de port</td>
                        <td>0 €</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>0 €</td>
                    </tr>
                </table>
                <Button title="Valider" />
            </div>
        </div>
    );
}

export default Cart;