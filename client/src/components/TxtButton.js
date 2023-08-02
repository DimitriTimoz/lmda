import React from "react";  
import "./TxtButton.css";
import { Link } from "react-router-dom";

export default function TxtButton({ title, onClick, className, link}) {
    if (link) {
        return (
            <Link to={link} className={`txt-button ${className}`}>
                {title}
            </Link>
        );
    }

    return (
        <span className={`txt-button ${className}`} onClick={onClick}>
            {title}
        </span>
    );
}
