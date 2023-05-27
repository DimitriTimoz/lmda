import React from "react";
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import ImagePicker from "../../components/ImagePicker";

export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: "",
            description: "",
            price: "",
            sex: "",
            condition: "",
            idk: "",
            previewImage: "",
            viewImage1: "",
            viewImage2: ""
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        this.setState({
            [name]: value
        });
    }

    submit = (event) => {
        event.preventDefault();
        console.log("submit", this.state);

        // You can make an API call or any other form submission logic here
    }

    render() {
        let sexes = ["femmes", "hommes"];
        return (
            <div className="add">
                <h3>Nouveau</h3>
                <form onSubmit={this.submit}>
                    <Input placeholder="Nom du produit" name="productName" onChange={this.handleInputChange} value={this.state.productName}/>
                    <Input type="textarea" placeholder="Description" name="description" onChange={this.handleInputChange} value={this.state.description}/>
                    <Input type="number" placeholder="Prix" name="price" onChange={this.handleInputChange} value={this.state.price}/>
                    <div className="selectors">
                        <Dropdown placeholder="sexe" name="sex" onChange={this.handleInputChange} elements={sexes} value={this.state.sex}/>
                        <Dropdown placeholder="etat" name="condition" onChange={this.handleInputChange} elements={sexes} value={this.state.condition}/>
                        <Dropdown placeholder="idk" name="idk" onChange={this.handleInputChange} elements={sexes} value={this.state.idk}/>
                    </div>
                    <ImagePicker utility="preview" name="previewImage" onChange={this.handleInputChange} value={this.state.previewImage}/>
                    <ImagePicker utility="view" name="viewImage1" onChange={this.handleInputChange} value={this.state.viewImage1}/>
                    <ImagePicker utility="view" name="viewImage2" onChange={this.handleInputChange} value={this.state.viewImage2}/>
                    <Button type="submit" title={"Ajouter"}/>
                </form>
            </div>
        )
    }
}
