import React from "react";
import Preview from "./Preview";
import Button from "../Button";
import axios from "axios";

export default class RawPreviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxRows: 1 || props.maxRows,
            maxRowsMobile: 2 || props.maxRowsMobile,
            mobile: false,
            width: 0,
            products: [],
            all: false,
        };
        this.containerRef = React.createRef();
        this.updateDimensions = this.updateDimensions.bind(this);
        this.showMore = this.showMore.bind(this);
        this.fetchMissingProducts = this.fetchMissingProducts.bind(this);
    }

    updateDimensions = () => {
        this.setState({ width: this.containerRef.current.offsetWidth, mobile: window.innerWidth < 700 }, () => {
            this.fetchMissingProducts();
        });
    };

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    conversion(pixel) {
        let rem = 0.0625 * pixel;
        return rem; 
    }

    showMore = () => {
        this.setState({ maxRows: this.state.maxRows + 2, maxRowsMobile: this.state.maxRowsMobile + 2},
            this.fetchMissingProducts());
    };

    computeNElementsPerRow = () => {
        return Math.floor(this.conversion(this.state.width) / (7 + this.conversion(10)))
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.filter !== this.props.filter || nextProps.category !== this.props.category) {
            this.setState({ products: [], all: false }, () => {
                this.fetchMissingProducts();
            });
        }
    }
      

    fetchProducts = (from, more) => {
        fetch(`/api/products/${this.props.category}/${this.props.filter}?from=${from}&more=${more}`)
            .then(response => {
                if (!response.ok) {
                    return;
                }
                return response.json(); 
            })
            .then(data => {
                if (data.products.length < more) {
                    this.setState({ all: true });
                }
                this.setState({ 
                    products: this.state.products.concat(data.products),
                });

            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            });
        
    }

    fetchMissingProducts = () => {
        let nElementsPerRow = this.computeNElementsPerRow();
        let nRows = 0; 
        if (this.state.mobile) {
            nRows = this.state.maxRowsMobile;
        } else {
            nRows = this.state.maxRows;
        }
        let amountOfProducts = nRows * nElementsPerRow;
        let missing = amountOfProducts - this.state.products.length;
        if (missing > 0 && !this.state.all) {
            this.fetchProducts(this.state.products.length, missing);
        }
    }

    render() {
        let products = this.state.products;
        return (
            <div>
                <div ref={this.containerRef} className="products-raw">
                    {products.map((product) => {
                        return <Preview product={product} key={product.id} />;
                    })}
                </div>
                {this.props.canShowMore && !this.state.all && <Button title="Afficher plus" onClick={this.showMore} />}
            </div>
        );
    }
}