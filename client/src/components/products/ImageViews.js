import "./ImageViews.css";
import React from "react";

export default class ImageViews extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.photos = this.props.photos || [];
        
        return (
            <div className={"image-views " + (this.photos.length === 1 ? "one-image" : "")}>
                {this.photos.map((photo, index) => { 
                    if (index === 0) {
                        return <img src={photo} className="image-views-image main-img"/>
                    } else if (index === 2 && this.photos.length > 3) {
                        let remaining = this.photos.length - 2;
                        return (
                            <div className="image-views-image remaining">
                                <img src={photo} className="image-views-image"/>
                                <span className="remaining-amount">+ {remaining}</span>
                            </div>
                        );
                    } else if (index < 3) {
                        return <img src={photo} className="image-views-image"/>
                    }

                    })
                }
            </div>
        );
    }

}