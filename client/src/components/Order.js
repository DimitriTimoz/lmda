import React, { Component } from "react";
import axios from "axios";
import "./Order.css";
import RawPreview from "./products/RawPreview";
import Button from "./Button";
import ErrorPopup from "./ErrorPopup";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            user: null,
            errorMessages: [],
        };

        if (props.order) {
            this.fetchProducts();
            this.fetchUser();
        }
    }

    shipOrder = async (forced = false) => {
        const { order, onChange } = this.props;

        if (!order) {
            console.log("No order");
            return;
        }

        if (window.confirm("Voulez-vous vraiment marquer cette commande comme expédiée ?")) {
            try {
                const response = await axios.put(`/api/order/${order.id}`, { shipped: true, forced });

                if (response.data.success && onChange) {
                    onChange();
                }
            } catch (err) {
                if (!err.response) {
                    console.error(err);
                    return;
                }
                this.setState((prevState) => ({
                    errorMessages: [...prevState.errorMessages, err.response.data.error],
                }));
            }
        }
    }

    shipOrderForce = async () => {
        await this.shipOrder(true);
    }

    fetchProducts = () => {
        for (const productId of this.props.order.products) {
            axios.get(`/api/product/${productId}`)
                .then((res) => {
                    if (res.status === 200) {
                        this.setState((prevState) => ({
                            products: [...prevState.products, res.data],
                        }));
                    }
                })
                .catch((err) => {
                    if (!err.response) {
                        console.error(err);
                        return;
                    }
                    this.setState((prevState) => ({
                        errorMessages: [...prevState.errorMessages, err.response.data.error],
                    }));
                });
        }
    }

    fetchUser = () => {
        axios.get(`/api/user/${this.props.order.user_id}`)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ user: res.data });
                }
            })
            .catch((err) => {
                if (!err.response) {
                    console.error(err);
                    return;
                }
                this.setState((prevState) => ({
                    errorMessages: [...prevState.errorMessages, err.response.data.error],
                }));
            });
    }

    getBordereau = () => {
        axios.get(`/api/order/bordereau/${this.props.order.id}`)
            .then((res) => {
                if (res.status === 200) {
                    this.props.onChange();
                    window.open(`https://www.mondialrelay.fr/${res.data.label.url}`, "_blank");
                }
            })
            .catch((err) => {
                if (!err.response) {
                    console.error(err);
                    return;
                }
                this.setState((prevState) => ({
                    errorMessages: [...prevState.errorMessages, err.response.data.error],
                }));
            });
    }

    render() {
        const { user } = this.state;
        const { order } = this.props;
        const massTotal = this.state.products.reduce((acc, product) => acc + product.mass, 0);

        return (
            <div id="order">
                {this.state.errorMessages.length > 0 &&
                    <ErrorPopup
                        error={this.state.errorMessages.join("\n")}
                        onClose={() => this.setState({ errorMessages: [] })}
                    />
                }
                <span className="close-btn" onClick={this.props.onClose}>Fermer</span>
                {order ?
                    <>
                        {user ?
                            <div className="column">
                                <h2>{user.name}</h2>
                                {order.address && <p>{order.address.address1}</p>}
                                {order.address && <p>{order.address.address2}</p>}
                                {order.address && <p>{order.address.zipCode + " " + order.address.city}</p>}
                                {order.address && <p>{order.address.country}</p>}
                                <p>{user.phone}</p>
                                <p>{user.email}</p>
                                <p>{"Point relai: " + order.delivery.parcelShopCode }</p>
                                {order.exp_number && <p>{"Numéro d'expédition: " + order.exp_number }</p> }
                                <p>{"Commandée le: " + (new Date(order.created_at)).toLocaleDateString('fr-fr')}</p>
                                <Button title="Obtenir bordereau" onClick={this.getBordereau} />
                            </div>
                            :
                            <div className="column">
                                <h2>Nom Prénom</h2>
                                <p>Adresse</p>
                                <p>Code postal</p>
                                <p>Ville</p>
                                <p>Pays</p>
                                <p>Téléphone</p>
                                <p>Email</p>
                            </div>  
                        }
                        <div className="column">
                        <h2>Produits</h2>
                            {this.state.products.length > 0 ?
                                <div className="product-list">
                                    {this.state.products.map((product) => {
                                        return (<RawPreview
                                            product={product}
                                        />);
                                    })}
                                </div>
                            :
                                <div className="product-list">
                                    <p>Chargement...</p>
                                </div>
                            }
                            {this.state.products.length > 0 && <p>{"Masse totale: " + massTotal + " g"}</p>}
                            {order.status < 1 && <>
                                <Button title="Marquer comme expédiée" onClick={() => this.shipOrder()} />
                                <Button title="Forcer marquer comme expédiée" onClick={() => this.shipOrderForce()} />
                            </>}
                        </div>
                    </>
                    :
                    <p>Chargement...</p>
                }
            </div>
        );
    }
}
