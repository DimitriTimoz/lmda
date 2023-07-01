import React from "react";
import "./ImageCarroussel.css";

export default class ImageCarroussel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            photos: [],
        };

        this.nextPhoto = this.nextPhoto.bind(this);
        this.prevPhoto = this.prevPhoto.bind(this);
        this.closeCarroussel = this.closeCarroussel.bind(this);
    }

    componentDidMount() {
        this.setState({ photos: this.props.photos });
    }

    selectPhoto(index) {
        this.setState({
            selected: index,
        });
    }

    closeCarroussel() {
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
            <div className="image-carroussel">
                <div className="image-carroussel-main">
                    <img src={selected_photo} className="image-carroussel-main-image"/>
                    <div className="image-carroussel-buttons">
                        <button className="image-carroussel-button" onClick={this.prevPhoto}>{"<"}</button>
                        <button className="image-carroussel-button" onClick={this.nextPhoto}>{">"}</button>
                    </div>
                </div>
                <div className="image-carroussel-thumbnails">
                    {this.state.photos.map((photo, index) => {
                        if (index === selected) {
                            return <img src={photo} className="image-carroussel-thumbnail selected" onClick={() => this.selectPhoto(index)}/>
                        } else {
                            return <img src={photo} className="image-carroussel-thumbnail" onClick={() => this.selectPhoto(index)}/>
                        }
                    }
                    )}
                </div>
                
            </div>
        );
    }
}
