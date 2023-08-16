import React from "react";
import "./Contact.css";
import Input from "../components/Input";
import Button from "../components/Button";


export default class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            message: "",
        };
        this.updateName = this.updateName.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    updateName(e) {
        this.setState({name: e.target.value});
    }

    updateEmail(e) {
        this.setState({email: e.target.value});
    }

    updateMessage(e) {
        this.setState({message: e.target.value});   
    }

    sendEmail(e) {
        e.preventDefault();
        let name = this.state.name;
        let email = this.state.email;
        let message = this.state.message;

        if (name === "" || email === "" || message === "") {
            alert("Veuillez remplir tous les champs");
            return;
        }

        window.location.href = 'mailto:contact@le-monde-de-anna.com?subject=Contact - ' + name + ' (' + email + ')' + '&body=' + message;
    }

    render() {
        return (
            <div className="contact">
                <h3>Contact</h3>
                <form className="contact-form">
                    <label>Nom Prénom</label>
                    <Input type="text" placeholder={"Nom"} value={this.state.name} onChange={this.updateName.bind(this)} required={true}/>
                    <label>Email</label>
                    <Input type="email" placeholder={"Email"} value={this.state.email} onChange={this.updateEmail.bind(this)} required={true}/>
                    <label>Message</label>
                    <textarea className="input" type="textarea" placeholder={"Message"} value={this.state.message} onChange={this.updateMessage.bind(this)} required/>
                    <Button onClick={this.sendEmail} className={"submit-btn"} type="submit" title={"Envoyer"}/>
                </form>
            </div>
        );
    }
}
