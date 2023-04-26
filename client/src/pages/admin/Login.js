import React from "react";  
import Input from "../../components/Input";
import "./Login.css";
import Button from "../../components/Button";
export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>login</h3>
                <form className="login-form">
                    <label>Email</label>
                    <Input type="email" placeholder={"prenom.nom@example.com"} />
                    <label>Password</label>
                    <Input type="password" placeholder={"Mot de passe"} />
                    <Button title={"Se connecter"}/>
                </form>
            </div>
        )
    }
}
    