import React from "react";
import ImageViews from "../components/products/ImageViews";
import Button from "../components/Button";
import LikeBtn from "../components/LikeBtn";

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

export default function Product() {
    const product_id = window.location.pathname.split("/")[2];
    const product = JSON.parse(localStorage.getItem("products")).find(
        (p) => p.id == product_id
    );

    if (!product) {
        // TODO: Get the product from the API
        return <div>Produit introuvable</div>;
    }


    return (
        <div>
            <div className="product">
                <ImageViews photos={product.photos}/>
                <div className="product-block">
                    <div>
                        <h2>{product.name}</h2>
                        <span className="price">{product.prices[0]} €</span>
                        <span className="product-description">
                            {product.description}
                        </span>
                    </div>
                    <div>
                        <Button title="Acheter" className="" onClick="alert(1)" />
                        <LikeBtn product={product} className="product-like" isFavorite={false} onToggleFavorite={()=>{}} />
                        <table className="product-details">
                            <tr>
                                <td>TAILLE</td>
                                <td>{product.size}</td>
                            </tr>
                            <tr>
                                <td>ÉTAT</td>
                                <td>{product.state}</td>
                            </tr>
                            <tr>
                                <td>Date d'ajout</td>
                                <td>{formatDate(product.date)}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}