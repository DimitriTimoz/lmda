import React from "react";
import Preview from "./Preview";

export default class RawPreviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxProducts: -1 || props.maxProducts,
            maxRows: -1 || props.maxRows,
        };

    }

    render() {
        
        let products = this.props.products;
        if (this.state.maxProducts > 0) {
            products = products.slice(0, this.state.maxProducts);
        }
        

        return (
            <div className="products-raw">
                {products.map((product) => {
                    return <Preview product={product} key={product.id} />;
                })}
            </div>
        );
    }
}