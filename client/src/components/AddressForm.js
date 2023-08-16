import React from "react";
import Input  from "./Input"
import "./AddressForm.css";

export default function AddressForm() {
    // TODO Set true apikey
    return (
        <div>
            <label class="full-field">
            <span class="form-label">Address*</span>
            <Input
                id="ship-address"
                name="ship-address"
                required
                autocomplete="off"
            />
            </label>
            <label class="full-field">
            <span class="form-label">Appartement, Etage...</span>
            <Input id="address2" name="address2" />
            </label>
            <label class="full-field">
            <span class="form-label">Ville</span>
            <Input id="locality" name="locality" required />
            </label>
            <label class="slim-field-left">
            <span class="form-label">Etat/Région</span>
            <Input id="state" name="state" required />
            </label>
            <label class="slim-field-right" for="postal_code">
            <span class="form-label">Code postal</span>
            <Input id="postcode" name="postcode" required />
            </label>
            <label class="full-field">
            <span class="form-label">Pays/Region</span>
            <Input id="country" name="country" required />
            </label>
      </div>  
    );
}
