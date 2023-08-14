import React from "react";
import "./ImageCarrousel.css";

export default class ImageCarrousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            photos: [],
        };

        this.nextPhoto = this.nextPhoto.bind(this);
        this.prevPhoto = this.prevPhoto.bind(this);
    }

    componentDidMount() {
        this.setState({ photos: this.props.photos });
    }

    nextPhoto() {
        const slidesContainer = document.getElementById("slides-container");
        const slide = document.querySelector(".slide");
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft += slideWidth;

    }

    prevPhoto() {
        const slidesContainer = document.getElementById("slides-container");
        const slide = document.querySelector(".slide");
        const slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft -= slideWidth;

    }

    render() {
        let selected = this.state.selected;
        if (this.props.enabled === false) {
            return <div></div>;
        }
  
        return (
            <section class="slider-wrapper">
                <button className="slide-arrow" id="slide-arrow-prev" onClick={this.prevPhoto}>
                    &#8249;
                </button>
                <button className="slide-arrow" id="slide-arrow-next" onClick={this.nextPhoto}>
                    &#8250;
                </button>
                <ul className="slides-container" id="slides-container">
                {this.state.photos.map((photo, index) => {
                        if (index === selected) {
                            return <li className="slide"><img src={photo} className="image-carrousel" alt="Prévisualisation du vêtement selectionnée" onClick={() => this.selectPhoto(index)}/></li>
                        } else {
                            return <li className="slide"><img src={photo} className="image-carrousel" alt="Prévisualisation selectionnable" onClick={() => this.selectPhoto(index)}/></li>
                        }
                    }
                )}
                </ul>
            </section>
        );
    }
}
