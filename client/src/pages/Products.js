import React, { useState, useEffect, useCallback } from "react";
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
    const { filter, category } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);

    let filter_arg = filter || "all";
    let category_arg = category || "all";
    const getProducts = useCallback(() => {
        fetch("/api/products/" + category_arg + "/" + filter_arg)
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("products", JSON.stringify(data.products));
                setProducts(data.products);
            });
    }, [category, filter]);

    // Trigger getProducts only when location changes
    useEffect(() => {
        getProducts();
    }, [location, getProducts]);

    return <ProductsBase products={products} getProducts={getProducts} />;
}

export default Products;
