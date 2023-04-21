import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <Link to="/">Conditions générales de vente</Link>
            <Link to="/">Mentions légales</Link>
            <Link to="/">Nous contacter</Link>
        </footer>
    );
}