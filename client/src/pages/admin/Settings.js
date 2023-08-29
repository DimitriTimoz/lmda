import React from "react";
import "./Settings.css";
import axios from "axios";
import Input from "../../components/Input";
import ErrorPopup from "../../components/ErrorPopup";
import Button from "../../components/Button";

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {},
            message: "",
        };
        this.settings = ["MontantLivraisonGratuiteFrance"]
        this.pull = this.pull.bind(this);
    }

    componentDidMount = () => {
        this.pull();
    }
    
    pull = () => {
        // Fetch settings from server
        axios.get("/api/settings").then((res) => {
            let settings = res.data;
            settings["MontantLivraisonGratuiteFrance"] = parseFloat(settings["MontantLivraisonGratuiteFrance"])/100;
            this.setState({ settings: settings });
        }).catch((err) => {
            this.setState({ message: err.response.data.error });
        });
    }

    submit = () => {
        let settings = this.state.settings;
        settings["MontantLivraisonGratuiteFrance"] = parseInt(settings["MontantLivraisonGratuiteFrance"]*100);
        axios.put("/api/settings/", this.state.settings).then((res) => {
            this.setState({ message: res.data.message });
            alert("Paramètres mis à jour");
        }).catch((err) => {
            this.setState({ message: err.response.data.error });
        });
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        if (isNaN(value)) {
            return;
        }

        const name = target.name;
        this.setState(prevState => ({
            settings: {
                ...prevState.settings,
                [name]: value
            }
        }));
    }

    render() {
        return (
            <div className="Settings">
                <h2>Paramètres</h2>
                <div className="settings-container">
                    {this.settings.map((setting) => {
                        return (
                        <div> 
                            <h3>{setting}</h3>
                            <Input name={setting} value={this.state.settings[setting]} onChange={this.handleInputChange} />
                        </div>);
                    }
                    )}
                </div>
                <Button title="Sauvegarder" onClick={this.submit} />
                {this.state.message.length > 0 && <ErrorPopup error={this.state.message} onClose={() => { this.setState({message: ""})}} />} 

            </div>
        );

    }
}