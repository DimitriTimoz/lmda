import React from "react";
import "./ImageViewer.css";

export default class ImageViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            selected: 0,
            photos: [],
            enabled: false
        };
    }

    render() {
        if (this.state.photos.length === 0) {
            return <div></div>;
        }

        let selected = this.state.selected;
        let selected_photo = this.state.photos[selected];

        return (
            <div className="image-viewer">
                <div className="image-viewer-main">
                    <img src={selected_photo} className="image-viewer-main-image"/>
                </div>
                <div className="image-viewer-thumbnails">
                    {this.state.photos.map((photo, index) => {
                        if (index === selected) {
                            return <img src={photo} className="image-viewer-thumbnail selected"/>
                        } else {
                            return <img src={photo} className="image-viewer-thumbnail"/>
                        }
                    }
                    )}
                </div>
            </div>
        );
    }

}