import React from "react";  

import "./Button.css";

export default function Button({ title, onClick, className, enabled = true}) {
    return (
        <button className={`button ${className}`} onClick={onClick} disabled={!enabled}>
            {title}
        </button>
    );
}