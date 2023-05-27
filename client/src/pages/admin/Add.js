import React from "react";
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import DropdownNav from "../../components/DropdownNav";
import ImagePicker from "../../components/ImagePicker";
import CAREGORIES_HOMMES from "../../data";
export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: "",
            description: "",
            price: "",
            specificCategory: "",
            previewImage: "",
            viewImage1: "",
            viewImage2: "",
            viewImage3: "",
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("name:", name, ", value:", value);
        this.setState({
            [name]: value
        });
    }

    submit = (event) => {
        event.preventDefault();
        console.log("submit", this.state);

        // You can make an API call or any other form submission logic here
    }

    onCategoryChange = (filter) => {
        console.log("onCategoryChange", filter);
    }

    render() {
        let categories = [
            "Homme",
            "Femme",
            "Enfant",
        ];
        return (
            <div className="add">
                <form className="form" onSubmit={this.submit}>
                    <h3>Nouveau</h3>
                    <Input placeholder="Nom du produit" name="productName" onChange={this.handleInputChange} value={this.state.productName}/>
                    <Input type="textarea" placeholder="Description" name="description" onChange={this.handleInputChange} value={this.state.description}/>
                    <Input type="number" placeholder="Prix" name="price" onChange={this.handleInputChange} value={this.state.price}/>
                    <Input type="number" placeholder="Frais de port à domicile" name="price" onChange={this.handleInputChange} value={this.state.price}/>
                    <Input type="number" placeholder="Frais de port en point relais" name="price" onChange={this.handleInputChange} value={this.state.price}/>

                    <div className="selectors">
                        <DropdownNav placeholder="Categorie" classicDpd={true} name="categorie" onChange={this.onCategoryChange} elements={categories} />
                        <DropdownNav placeholder="Hommes" name="specificCategory" onChange={this.handleInputChange} elements={CAREGORIES_HOMMES} />
                    </div>
                    <div className="images-pickers">
                        <ImagePicker utility="preview" name="previewImage" onChange={this.handleInputChange} value={this.state.previewImage}/>
                        <ImagePicker utility="view" name="viewImage1" onChange={this.handleInputChange} value={this.state.viewImage1}/>
                        <ImagePicker utility="view" name="viewImage2" onChange={this.handleInputChange} value={this.state.viewImage2}/>
                        <ImagePicker utility="view" name="viewImage3" onChange={this.handleInputChange} value={this.state.viewImage2}/>
                    </div>
                    <Button className={"submit-btn"} type="submit" title={"Ajouter"}/>
                </form>
            </div>
        )
    }
}
