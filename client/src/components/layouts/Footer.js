import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div>
            <footer className="footer">
                <a href="/CGV.pdf">Conditions générales de vente</a>
                <a href="/CGV.pdf">Mentions légales</a>
                <Link to="/contact">Nous contacter</Link>
            </footer>
            <div className="footer-bottom"></div>
        </div>
    );
}