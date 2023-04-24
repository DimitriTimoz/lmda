import "./Preview.css";
import React from "react";
import { Link } from "react-router-dom";
import LikeBtn from "../LikeBtn";

export default function Preview({ product }) {
    return (
        <div className="preview">
            <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="preview-image"/>
            </Link>
            <div className="preview-details">
                <span>{product.price} €</span>
                <div className="preview-like-size">
                    <span className="product-size">{product.size}</span>
                    <LikeBtn pid={product.id} className="product-like" isFavorite={false} onToggleFavorite={()=>{}} />
                </div>
            </div>
        </div>
    );
}