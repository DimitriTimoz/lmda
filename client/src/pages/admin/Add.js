import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import DropdownNav from "../../components/DropdownNav";
import ImagePicker from "../../components/ImagePicker";
import { CAREGORIES_HOMMES, CAREGORIES_ENFANTS, CAREGORIES_FEMMES }from "../../data";
import axios from 'axios';

const Add = (props) => {
    const [productState, setProductState] = useState({
        id: null,  // Add an id field to your state
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
    });
    
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setProductState(prevState => ({ ...prevState, id: id}));
            axios.get(`/api/product/${id}`)
                .then(response => {
                    // Use the existing item data to set our state
                    /*{
                    "id": 70,
                    "name": "Ava + Viv • 1x Wrap Dress",
                    "description": " [Offers always welcome!] [I hold bundles for one hour listed for specified &#x27;Vinted customer&#x27;. After that, I will relist those items] [I do not reserve items] [If you offer a price, please be prepared to purchase! 😀] Thank you!",
                    "prices": [
                        6,
                        1,
                        1
                    ],
                    "size": "16",
                    "kind": "femme",
                    "state": 1,
                    "photos": [
                        "73",
                        "74",
                        "75",
                        "NaN"
                    ],
                    "date": "2023-06-29T13:45:36.967Z"
                }*/
                    const item = response.data;
                    setProductState(prevState => ({ ...prevState, 
                        productName: item.name,
                        description: item.description,
                        price: item.prices[0],
                        homeDeliveryPrice: item.prices[1],
                        relayDeliveryPrice: item.prices[2],
                        category: item.kind,
                        specificCategory: item.subCategory,
                        previewImage: item.photo_ids[0],
                        viewImage1: item.photo_ids[1],
                        viewImage2: item.photo_ids[2],
                        viewImage3: item.photo_ids[3],
                        size: item.size,
                    }));
                })
                .catch(error => console.error(error));
        }
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProductState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submit = (event) => {
        event.preventDefault();
        let body = {
            id: productState.id,
            name: productState.productName,
            description: productState.description,
            price: productState.price,
            homeDeliveryPrice: productState.homeDeliveryPrice,
            relayDeliveryPrice: productState.relayDeliveryPrice,
            previewImage: productState.previewImage,
            otherImages: [productState.viewImage1, productState.viewImage2, productState.viewImage3],
            category: productState.category,
            subCategory: productState.specificCategory,
            size: productState.size,
            state: productState.state,
        }
        console.log("submit", productState);
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

    let categories = {
        "homme" : CAREGORIES_HOMMES,
        "femme" : CAREGORIES_FEMMES,
        "enfant" : CAREGORIES_ENFANTS,
    };
    return (
        <div className="add">
            <form className="form" onSubmit={submit}>
                <h3>Nouveau</h3>
                <Input placeholder="Nom du produit" name="productName" onChange={handleInputChange} />
                <Input type="textarea" placeholder="Description" name="description" onChange={handleInputChange} />
                <Input type="number" placeholder="Prix" name="price" onChange={handleInputChange} />
                <Input type="number" placeholder="Frais de port à domicile" name="homeDeliveryPrice" onChange={handleInputChange} />
                <Input type="number" placeholder="Frais de port en point relais" name="relayDeliveryPrice" onChange={handleInputChange} />
                <Input placeholder="Taille" name="size" onChange={handleInputChange} />
                <select name="state" id="state" onChange={handleInputChange} >
                    <option value="0">Nouveau</option>
                    <option value="1">Très bon</option>
                    <option value="2">Bon</option>
                    <option value="3">Correct</option>
                    <option value="4">Moyen</option>
                    <option value="5">Mauvais</option>
                </select>
                <div className="selectors">
                    <select name="category" id="category" onChange={handleInputChange} >
                        <option value="homme">homme</option>
                        <option value="femme">femme</option>
                        <option value="enfant">enfant</option>
                    </select>
                    <DropdownNav placeholder={productState.category} slector={false} name="specificCategory" onChange={handleInputChange} elements={categories[productState.category]} />
                </div>
                <div className="images-pickers">
                    <ImagePicker utility="preview" name="previewImage" onChange={handleInputChange} value={productState.previewImage}/>
                    <ImagePicker utility="view" name="viewImage1" onChange={handleInputChange} value={productState.viewImage1}/>
                    <ImagePicker utility="view" name="viewImage2" onChange={handleInputChange} value={productState.viewImage2}/>
                    <ImagePicker utility="view" name="viewImage3" onChange={handleInputChange} value={productState.viewImage2}/>
                </div>
                <Button className={"submit-btn"} type="submit" title={"Envoyer"}/>
            </form>
        </div>
    )
    
}

export default Add;
