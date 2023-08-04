import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import Preview from "../components/products/Preview";
import "./Products.css";

function ProductsBase({ products, getProducts, category }) {
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <div id="products-base">
            <h2>{category}</h2>
            <div id="products">
                {products.length === 0 ? <div>Aucun produit dans cette catégorie</div> :
                    products.map((product) => {
                        return <Preview key={product.id} product={product} />;
                    })
                }
            </div>
        </div>
    );
}

function Products(props) {
    const { filter, category } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);

    let filter_arg = filter || "all";
    let category_arg = category || "all";
    let categ_name = "Tous les produits";
    if (category_arg !== "all") {
        if (filter_arg !== "all") {
            let filters = filter_arg.split(":");
            categ_name = filters[filters.length - 1].split("-").join(" ");
            categ_name = categ_name.charAt(0).toUpperCase() + categ_name.slice(1);
        } else {
            categ_name = category_arg.charAt(0).toUpperCase() + category_arg.slice(1);
        }
    }
    
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

    return <ProductsBase products={products} getProducts={getProducts} category={categ_name} />;
}

export default Products;
