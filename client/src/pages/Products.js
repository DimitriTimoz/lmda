import React from "react";
import { useParams } from "react-router-dom";
import Preview from "../components/products/Preview";

class Products extends React.Component {
    constructor(props) {
        super(props);
        let filter = this.props.filter;
        let category = this.props.category;
        if (!filter) {
            filter = "all";
        }

        if (!category) {
            category = "all";
        }

        this.state = {
            filter: filter,
            category: category,
            products: []
        };
    }

    componentDidMount() {
        this.getProducts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filter !== this.props.filter) {
            this.getProducts();
        }
    }

    getProducts() {
        fetch("/api/products/" + this.state.category + "/" + this.state.filter)
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("products", JSON.stringify(data.products));
                this.setState({ products: data.products });
            });
    }

    render() {
        return (
            <div id="products">
                <h1>Products</h1>
                {this.state.products.map((product) => {
                    return <Preview key={product.id} product={product} />;
                })}
            </div>
        );
    }
}

// Create a higher-order component that uses the useParams hook
function withParams(Component) {
    return function WrappedComponent(props) {
        const { filter } = useParams();
        return <Component {...props} filter={filter} />;
    };
}

// Use the HOC when exporting
export default withParams(Products);
