import React from "react";  
import "./TxtButton.css";

export default function TxtButton({ title, onClick, className}) {
    return (
        <span className={`txt-button ${className}`} onClick={onClick}>
            {title}
        </span>
    );
}
