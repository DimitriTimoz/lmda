import React from "react";
import Input  from "./Input"
import "./AddressForm.css";

export default function AddressForm(props) {
    const [address, setAddress] = React.useState(props.address || {});

    const updateField = (e) => {
        setAddress({
            ...props.address,
            [e.target.name]: e.target.value,
        });

        if (props.setAddress) {
            props.setAddress({
                ...props.address,
                [e.target.name]: e.target.value,
            });
        }
    }
    
    return (
        <div className="address-form">
            <label class="full-field">
                <span class="form-label">Address*</span>
                <Input
                    id="ship-address"
                    name="address1"
                    required
                    autocomplete="off"
                    placeholder="19 Rue, Avenue, Boulevard..."
                    onChange={updateField}
                />
            </label>
            <label class="full-field">
                <span class="form-label">Appartement, Etage...</span>
                <Input id="address2" name="address2" onChange={updateField} placeholder="Appartement 13, Etage 2" />
            </label>
            <label class="full-field">
                <span class="form-label">Ville</span>
                <Input id="city" name="city" onChange={updateField} required placeholder="Paris, Rouen..."/>
            </label>
            <label class="slim-field-left">
                <span class="form-label">Etat/Région</span>
                <Input id="state" name="state" onChange={updateField} required placeholder="Normandie, Bretagne..." />
            </label>
            <label class="slim-field-right" for="zipCode">
                <span class="form-label">Code postal</span>
                <Input id="postcode" name="zipCode" onChange={updateField} required placeholder="76100, 52100..." />
            </label>
            <label class="full-field" for="country">
                <span class="form-label">Pays/Region</span>
                <Input id="country" name="country" onChange={updateField} required placeholder="France, Espagne..."/>
            </label>
      </div>  
    );
}
