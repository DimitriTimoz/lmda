import React from "react";
import "./RawPreview.css";
import TxtButton from "../TxtButton";


export default function RawPreview({ product }) {
    return (
        <div className="raw-preview">
            <img src={product.image} alt={product.name} className="raw-preview-image"/>
            <div className="raw-preview-left">
                <h4 className="p-name" >{product.name}</h4>
                <span className="p-details" >{product.size + " - " + product.state}</span>
                <TxtButton title="Supprimer" className="view-button" onClick={()=>{}} />
            </div>
            <span className="price" >{product.price}&nbsp;€</span>
        </div>
    );
}