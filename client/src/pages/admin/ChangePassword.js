import React from "react";
import "./ChangePassword.css";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const response = await fetch("/api/users/changePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: this.state.password,
                newPassword: this.state.newPassword,
            }),
        });
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
                <form onSubmit={this.handleSubmit}>
                    <h1>Changer le mot de passe</h1>
                    <label htmlFor="password">Mot de passe actuel</label>
                    <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                    <input type="password" name="newPassword" id="newPassword" value={this.state.newPassword} onChange={this.handleChange} />
                    <label htmlFor="newPasswordConfirm">Confirmer le nouveau mot de passe</label>
                    <input type="password" name="newPasswordConfirm" id="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={this.handleChange} />
                    <input type="submit" value="Changer le mot de passe" />
                    <p className="error">{this.state.error}</p>
                    <p className="success">{this.state.success}</p>
                </form>
            </div>
        );
    }
}