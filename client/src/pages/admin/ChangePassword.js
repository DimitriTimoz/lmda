import React from "react";
import "./ChangePassword.css";
import './Login.css';
import Input from "../../components/Input";
import Button from "../../components/Button";
import axios from "axios";

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            newPassword: "",
            newPasswordConfirm: "",
            error: "",
            success: "",
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ error: "", success: "" });
        if (this.state.newPassword !== this.state.newPasswordConfirm) {
            this.setState({ error: "Les mots de passe ne correspondent pas" });
            return;
        }
        const response = await axios.post("/api/user/change-password", this.state);
        const body = await response.json();
        if (response.status !== 200) {
            this.setState({ error: body.error });
        } else {
            this.setState({ success: body.message });
        }
    }

    render() {
        return (
            <div className="ChangePassword">
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <h3>Changer le mot de passe</h3>
                    <label htmlFor="password">Email</label>
                    <Input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                    <label htmlFor="password">Mot de passe actuel</label>
                    <Input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                    <Input type="password" name="newPassword" id="newPassword" value={this.state.newPassword} onChange={this.handleChange} />
                    <label htmlFor="newPasswordConfirm">Confirmer le nouveau mot de passe</label>
                    <Input type="password" name="newPasswordConfirm" id="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={this.handleChange} />
                    <Button type="submit" title="Changer le mot de passe" onClick={this.handleSubmit} />
                    <p className="error">{this.state.error}</p>
                    <p className="success">{this.state.success}</p>
                </form>
            </div>
        );
    }
}