import React from "react";
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import ImagePicker from "../../components/ImagePicker";
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
                <ImagePicker utility="preview"/>
                <ImagePicker utility="view"/>
                <ImagePicker utility="view"/>
                <Button title={"Ajouter"}/>
            </div>
        )
    }
}