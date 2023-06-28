import React from "react";
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import DropdownNav from "../../components/DropdownNav";
import ImagePicker from "../../components/ImagePicker";
import { CAREGORIES_HOMMES, CAREGORIES_ENFANTS, CAREGORIES_FEMMES }from "../../data";
import axios from 'axios';

export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: "",
            description: "",
            price: 0,
            homeDeliveryPrice: 0,
            relayDeliveryPrice: 0,
            category: "femme",
            specificCategory: "",
            previewImage: "",
            viewImage1: "",
            viewImage2: "",
            viewImage3: "",
            size: "",
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

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

    submit = (event) => {
        event.preventDefault();
        let body = {
            name: this.state.productName,
            description: this.state.description,
            price: this.state.price,
            homeDeliveryPrice: this.state.homeDeliveryPrice,
            relayDeliveryPrice: this.state.relayDeliveryPrice,
            previewImage: this.state.previewImage,
            otherImages: [this.state.viewImage1, this.state.viewImage2, this.state.viewImage3],
            category: this.state.category,
            subCategory: this.state.specificCategory,
            size: this.state.size,
            state: this.state.state,
        }
        console.log("submit", this.state);
        axios.post('/api/product', body)
            .then(response => {
                if (response.status === 200) {
                    // Redirect to admin page
                    alert("Produit ajouté");
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
        let categories = {
            "homme" : CAREGORIES_HOMMES,
            "femme" : CAREGORIES_FEMMES,
            "enfant" : CAREGORIES_ENFANTS,
        };
        return (
            <div className="add">
                <form className="form" onSubmit={this.submit}>
                    <h3>Nouveau</h3>
                    <Input placeholder="Nom du produit" name="productName" onChange={this.handleInputChange} />
                    <Input type="textarea" placeholder="Description" name="description" onChange={this.handleInputChange} />
                    <Input type="number" placeholder="Prix" name="price" onChange={this.handleInputChange} />
                    <Input type="number" placeholder="Frais de port à domicile" name="homeDeliveryPrice" onChange={this.handleInputChange} />
                    <Input type="number" placeholder="Frais de port en point relais" name="relayDeliveryPrice" onChange={this.handleInputChange} />
                    <Input placeholder="Taille" name="size" onChange={this.handleInputChange} />
                    <select name="state" id="state" onChange={this.handleInputChange} >
                        <option value="0">Nouveau</option>
                        <option value="1">Très bon</option>
                        <option value="2">Bon</option>
                        <option value="3">Correct</option>
                        <option value="4">Moyen</option>
                        <option value="5">Mauvais</option>
                    </select>
                    <div className="selectors">
                        <select name="category" id="category" onChange={this.handleInputChange} >
                            <option value="homme">homme</option>
                            <option value="femme">femme</option>
                            <option value="enfant">enfant</option>
                        </select>
                        <DropdownNav placeholder={this.state.category} name="specificCategory" onChange={this.handleInputChange} elements={categories[this.state.category]} />
                    </div>
                    <div className="images-pickers">
                        <ImagePicker utility="preview" name="previewImage" onChange={this.handleInputChange} value={this.state.previewImage}/>
                        <ImagePicker utility="view" name="viewImage1" onChange={this.handleInputChange} value={this.state.viewImage1}/>
                        <ImagePicker utility="view" name="viewImage2" onChange={this.handleInputChange} value={this.state.viewImage2}/>
                        <ImagePicker utility="view" name="viewImage3" onChange={this.handleInputChange} value={this.state.viewImage2}/>
                    </div>
                    <Button className={"submit-btn"} type="submit" title={"Envoyer"}/>
                </form>
            </div>
        )
    }
}
