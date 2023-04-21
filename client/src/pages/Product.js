import React from "react";
import ImageViews from "../components/ImageViews";
import Button from "../components/Button";
import LikeBtn from "../components/LikeBtn";

import "./Product.css";

export default function Product() {
    const product_id = window.location.pathname.split("/")[2];
    let product = {
        photos: ["/images/clothes/main_1.png", "/images/clothes/second_1_1.png", "/images/clothes/second_2_1.png", "/images/clothes/second_2_1.png"],
        name: "T-shirt",
        size: "M",
        description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
        price: 20,
        id: 1
    }



    return (
        <div>
            <div className="product">
                <ImageViews photos={product.photos}/>
                <div className="product-block">
                    <div>
                        <h2>{product.name}</h2>
                        <span className="price">{product.price} €</span>
                        <span className="product-description">
                            {product.description}
                        </span>
                    </div>
                    <div>
                        <Button title="Acheter" className="" onClick="alert(1)" />
                        <LikeBtn product={product} isFavorite={false} onToggleFavorite={()=>{}} />
                        <div className="product-details">
                            <table>
                                <tr>
                                    <td>TAILLE</td>
                                    <td>XL</td>
                                </tr>
                                <tr>
                                    <td>ÉTAT</td>
                                    <td>Très bon</td>
                                </tr>
                                <tr>
                                    <td>Date d'ajout</td>
                                    <td>13/03/2023</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}