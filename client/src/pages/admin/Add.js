import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./Add.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import DropdownNav from "../../components/DropdownNav";
import ImagePicker from "../../components/ImagePicker";
import { CAREGORIES_HOMMES, CAREGORIES_ENFANTS, CAREGORIES_FEMMES } from "../../data";
import axios from 'axios';
import ErrorPopup from "../../components/ErrorPopup";

function zip(arrays) {
    return arrays[0].map((_, i) => [arrays[0][i], arrays[1][i]]);
}

const Add = (props) => {
    const [productState, setProductState] = useState({
        id: null,  // Add an id field to your state
        name: "",
        description: "",
        price: 0,
        mass: 0,
        category: "femme",
        specifyCategory: "",
        photosIds: ["", "", "", ""],
        photosSrc: [],
        size: "",
        state: "1",
        message: "",
    });
    
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`/api/product/${id}`)
                .then(response => {
                    // Use the existing item data to set our state
                    const item = response.data;
                    setProductState(prevState => {
                        return {
                        ...prevState,
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: parseFloat(item.prices[0])/100,
                        mass: item.mass,
                        category: item.category,
                        specifyCategory: item.specifyCategory,
                        photosIds: item.photo_ids.filter((id) => id),
                        photosSrc: item.photos,
                        state: item.state,
                        size: item.size,
                        message: "",
                    }});
                })
                .catch(error => {
                    setProductState(prevState => ({
                        ...prevState,
                        message: error.response.data.error,
                    }));
                    console.log(error.response.data.error)
                });
        }
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(productState);

        setProductState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    
    const handleImageChange = (index, value) => {
        let newPhotoIds = [...productState.photosIds]; // copy the array
        newPhotoIds[index] = value.target.value; // replace the value at index
    
        setProductState(({
            ...productState,
            photosIds: newPhotoIds
        }));
    };

    const closePopup = () => {
        setProductState(({
            ...productState,
            message: ""
        }));
    }
    

    const submit = (event) => {
        event.preventDefault();
        let body = {
            id: productState.id,
            name: productState.name,
            description: productState.description,
            price: parseInt(productState.price*100),
            mass: productState.mass,
            photosIds: productState.photosIds.filter((id) => !isNaN(id)),
            category: productState.category,
            specifyCategory: productState.specifyCategory,
            size: productState.size,
            state: productState.state,
        }
        console.log("submit", productState);
        axios.post('/api/product', body)
            .then(response => {
                if (response.status === 200) {
                    // Redirect to admin page
                    alert("Produit mis à jour avec succès !");
                } else {
                    // Display error message
                    setProductState( prevState => ({...prevState, message: response.data.error }));
                }
                
            })
            .catch(error => {
                // Code à exécuter en cas d'erreur
                console.log(error.response.data.error);
                setProductState( prevState => ({...prevState, message: error.response.data.error }));
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
                <Input placeholder="Nom du produit" name="name" value={productState.name} onChange={handleInputChange} />
                <Input type="textarea" placeholder="Description" name="description" value={productState.description} onChange={handleInputChange} />
                <Input type="number" placeholder="Prix" name="price" value={productState.price} onChange={handleInputChange} />
                <Input type="number" placeholder="Masse" name="mass" value={productState.mass} onChange={handleInputChange} />
                <Input placeholder="Taille" name="size" value={productState.size} onChange={handleInputChange} />
                <select className="select-container select-dropdown" name="state" id="state" value={productState.state} onChange={handleInputChange} >
                    <option value="1">Très bon</option>
                    <option value="2">Bon</option>
                    <option value="3">Correct</option>
                    <option value="4">Moyen</option>
                    <option value="5">Mauvais</option>
                </select>
                <div className="selectors">
                    <select className="select-container select-dropdown" name="category" id="category" value={productState.category} onChange={handleInputChange} >
                        <option value="homme">homme</option>
                        <option value="femme">femme</option>
                        <option value="enfant">enfant</option>
                    </select>
                    <DropdownNav placeholder={productState.category} selector={true} name="specifyCategory"  onChange={handleInputChange} elements={categories[productState.category]} />
                </div>
                <div className="images-pickers">
                {zip([productState.photosIds, productState.photosSrc]).map((image, index) => {
                    let src = image[1] ? "/uploads/" + image[1] : "";
                    if (index === 0) {
                        return (
                            <ImagePicker 
                                key={index}
                                src={src}
                                utility="preview" 
                                name={`viewImage${index}`} 
                                onChange={(value) => handleImageChange(index, value)}
                                value={image[0]}
                            />
                        )
                    }
                    return (
                    <ImagePicker 
                        key={index}
                        src={src}
                        utility="view" 
                        name={`viewImage${index}`} 
                        onChange={(value) => handleImageChange(index, value)}
                        value={image[0]}
                    />
                    )})}
                </div>

                <Button className={"submit-btn"} type="submit" title={"Envoyer"}/>
            </form>
            {productState.message.length > 0  &&
                <ErrorPopup error={productState.message} onClose={closePopup} />
            }
        </div>
    )
    
}

export default Add;
