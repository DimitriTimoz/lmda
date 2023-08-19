import React from "react";
import Preview from "./Preview";

export default class RawPreviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxRows: 1 || props.maxRows,
            maxRowsMobile: 2 || props.maxRowsMobile,
            mobile: false,
            width: 0,
        };
        this.containerRef = React.createRef();
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions = () => {
        this.setState({ width: this.containerRef.current.offsetWidth, mobile: window.innerWidth < 700 });
    };

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    Conversion(pixel)
    {
        let rem = 0.0625 * pixel;
        return rem; 
    }

    render() {
        let products = this.props.products;
       
        if (this.state.maxRows > 0 || this.state.maxRowsMobile > 0) {
            let n_elements_per_row = Math.floor(this.Conversion(this.state.width) / (7 + this.Conversion(10)));
            if (this.state.mobile && this.state.maxRowsMobile > 0) {
                products = products.slice(0, this.state.maxRowsMobile * n_elements_per_row);
            } else if (this.state.maxRows > 0) {
                products = products.slice(0, this.state.maxRows * n_elements_per_row);
            }        
        }

        return (
            <div ref={this.containerRef} className="products-raw">
                {products.map((product) => {
                    return <Preview product={product} key={product.id} />;
                })}
            </div>
        );
    }
}