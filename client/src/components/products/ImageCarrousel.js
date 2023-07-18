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
        this.closeCarrousel = this.closeCarrousel.bind(this);
    }

    componentDidMount() {
        this.setState({ photos: this.props.photos });
    }

    selectPhoto(index) {
        this.setState({
            selected: index,
        });
    }

    closeCarrousel() {
        this.props.enabled = false;
    }

    nextPhoto() {
        let selected = this.state.selected;
        let photos = this.state.photos;
        if (selected < photos.length - 1) {
            this.setState({ selected: selected + 1 });
        }
    }

    prevPhoto() {
        let selected = this.state.selected;
        if (selected > 0) {
            this.setState({ selected: selected - 1 });
        }
    }

    render() {
        let selected = this.state.selected;
        let selected_photo = this.state.photos[selected];
        if (this.props.enabled === false) {
            return <div></div>;
        }
        return (
            <div className="image-carrousel">
                <div className="image-carrousel-main">
                    <img src={selected_photo} className="image-carrousel-main-image" alt="Prévisualisation du vêtement principale"/>
                    <div className="image-carrousel-buttons">
                        <button className="image-carrousel-button" onClick={this.prevPhoto}>{"<"}</button>
                        <button className="image-carrousel-button" onClick={this.nextPhoto}>{">"}</button>
                    </div>
                </div>
                <div className="image-carrousel-thumbnails">
                    {this.state.photos.map((photo, index) => {
                        if (index === selected) {
                            return <img src={photo} className="image-carrousel-thumbnail selected" alt="Prévisualisation du vêtement selectionnée" onClick={() => this.selectPhoto(index)}/>
                        } else {
                            return <img src={photo} className="image-carrousel-thumbnail" alt="Prévisualisation selectionnable" onClick={() => this.selectPhoto(index)}/>
                        }
                    }
                    )}
                </div>
                
            </div>
        );
    }
}
