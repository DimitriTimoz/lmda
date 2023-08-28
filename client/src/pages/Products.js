import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Products.css";
import { trimMatchesFromEnd } from "../utils";
import RawPreviews from "../components/products/RawPreviews";

function ProductsBase({categName, category, filter }) {
    const [productState, setProductState] = useState({
        state: "0",
    });

    return (
        <div id="products-base">
            <h2>{categName}</h2>
            <select className="select-container select-dropdown" name="state" id="state" value={productState.state} onChange={(e) => setProductState({ state: e.target.value })}>
                <option value="0">Tous les états</option>
                <option value="1">Très bon</option>
                <option value="2">Bon</option>
                <option value="3">Correct</option>
                <option value="4">Moyen</option>
                <option value="5">Mauvais</option>
            </select>
            <RawPreviews category={category} filter={filter} state={productState.state} canShowMore={true} />
        </div>
    );
}

export default function Products() {
    const { filter, category } = useParams();
    const location = useLocation();
    const [state, setState] = useState({}); 
    let filter_arg = filter || "all";
    let category_arg = category || "all";
    filter_arg = trimMatchesFromEnd(filter_arg, ":"); 
    let categName = "Tous les produits";

    if (category_arg !== "all") {
        if (filter_arg !== "all") {
            let filters = filter_arg.split(":");
            categName = filters[filters.length - 1].split("-").join(" ");
            categName = categName.charAt(0).toUpperCase() + categName.slice(1);
        } else {
            categName = category_arg.charAt(0).toUpperCase() + category_arg.slice(1);
        }
    }
        
    useEffect(() => {
        setState({ location });
    }, [location]);

    return <ProductsBase categName={categName} category={category_arg} filter={filter_arg} />;
}
