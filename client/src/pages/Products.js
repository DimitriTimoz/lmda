import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Preview from "../components/products/Preview";

function ProductsBase({ products, getProducts }) {
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <div id="products">
            <h2>Products</h2>
            {products.length === 0 ? <div>Aucun produit dans cette catégorie</div> :
                products.map((product) => {
                    return <Preview key={product.id} product={product} />;
                })
            }
            
        </div>
    );
}

function Products(props) {
    const { filter } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);

    let category = props.category || "all";

    const getProducts = () => {
        fetch("/api/products/" + category + "/" + filter)
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("products", JSON.stringify(data.products));
                setProducts(data.products);
            });
    };

    // Trigger getProducts whenever location changes
    useEffect(() => {
        getProducts();
    }, [location, filter, category]);

    return <ProductsBase products={products} getProducts={getProducts} />;
}

export default Products;
