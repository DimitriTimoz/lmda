import React from "react";
import ImageViews from "../components/ImageViews";

export default function Product() {
    const product_id = window.location.pathname.split("/")[2];
    let product = {
        photos: ["/images/clothes/main_1.png", "/images/clothes/second_1_1.png", "/images/clothes/second_2_1.png", "/images/clothes/second_2_1.png"],
        name: "T-shirt",
        size: "M",
        price: 20,
        id: 1
    }



    return (
        <div>
        <p>Product</p>
        <p>{product_id}</p>
        <ImageViews photos={product.photos}/>
        </div>
    );
}