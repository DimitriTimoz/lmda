import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import Preview from "../components/products/Preview";
import "./Products.css";

function ProductsBase({ products, category }) {

    const [productState, setProductState] = useState({
        state: "0",
    });

    let products_filtrerd = products.filter((product) => {
        if (productState.state === "0") {
            return true;
        } else {
            return product.state === parseInt(productState.state);
        }
    });

    return (
        <div id="products-base">
            <h2>{category}</h2>
            {products_filtrerd.length === 0 ? <div>Aucun produit dans cette catégorie</div> :
                <div>
                <select className="select-container select-dropdown" name="state" id="state" value={productState.state} onChange={(e) => setProductState({ state: e.target.value })}>
                    <option value="0">Tous les états</option>
                    <option value="1">Très bon</option>
                    <option value="2">Bon</option>
                    <option value="3">Correct</option>
                    <option value="4">Moyen</option>
                    <option value="5">Mauvais</option>
                </select>
                <div id="products">
                        {products_filtrerd.map((product) => {
                            return <Preview key={product.id} product={product} />;
                        })}
                </div>
            </div>
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
    }, [location]);

    return <ProductsBase products={products} category={categ_name} />;
}

export default Products;
