import React from "react";

export default function Product() {
    const product_id = window.location.pathname.split("/")[2];
  
    return (
        <div>
        <p>Product</p>
        <p>{product_id}</p>
        </div>
    );
}