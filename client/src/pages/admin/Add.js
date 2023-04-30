import React from "react";
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";

export default class Add extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let sexes = [
                "femmes",
                "hommes",
            ];
        return (
            <div className="add">
                <h3>Nouveau</h3>
                <Input placeholder="Nom du produit"/>
                <Input type="textarea" placeholder="Description"/>
                <Input type="number" placeholder="Prix"/>
                <div className="selectors">
                    <Dropdown placeholder="sexe" elements={sexes}/>
                    <Dropdown placeholder="etat" elements={sexes}/>
                    <Dropdown placeholder="idk" elements={sexes}/>
                </div>
                <Button title={"Ajouter"}/>
            </div>
        )
    }
}