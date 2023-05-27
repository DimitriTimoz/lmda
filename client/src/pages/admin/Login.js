import React from "react";  
import Input from "../../components/Input";
import "./Login.css";
import Button from "../../components/Button";
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            message: ""
        };
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    updateEmail(e) {
        this.setState({email: e.target.value});
    }

    updatePassword(e) {
        this.setState({password: e.target.value});
    }

    submit(e) {
        e.preventDefault();
        let email = this.state.email;
        let password = this.state.password;

        if (email === "" || password === "") {
            alert("Veuillez remplir tous les champs");
            return;
        }

        axios.post('/api/login', { email, password })
            .then(response => {
                if (response.status === 200) {
                    // Redirect to admin page
                    window.location.href = "/admin/add";
                } else {
                    // Display error message
                    this.setState({message: response.data.message});
                }
                
            })
            .catch(error => {
                // Code à exécuter en cas d'erreur
                console.error(error.message);
            });
    }

    render() {
        return (
            <div className="login">
                <h3>Login</h3>
                <form className="login-form">
                    <label>Email</label>
                    <Input type="email" placeholder={"prenom.nom@example.com"} value={this.state.email} onChange={this.updateEmail.bind(this)}/>
                    <label>Password</label>
                    <Input type="password" placeholder={"Mot de passe"} value={this.state.password} onChange={this.updatePassword.bind(this)}/>
                    <p className="error-message">{this.state.message}</p>
                    <Button title={"Se connecter"} onClick={this.submit.bind(this)}/>
                </form>
            </div>
        )
    }
}
