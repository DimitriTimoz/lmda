import React from "react";
import Input  from "./Input"
import "./PersonalForm.css";

export default function PersonalForm(props) {
    const [infos, setInfos] = React.useState(props.infos || {});
    const updateField = (e) => {
        setInfos({
            ...props.infos,
            [e.target.name]: e.target.value,
        });

        if (props.setInfos) {
            props.setInfos({
                ...props.infos,
                [e.target.name]: e.target.value,
            });
        }
    }
    
    return (
        <div className="infos-form">
            <label class="full-field">
                <select className="select-container select-dropdown" name="gender" onChange={updateField} value={infos.gender}>
                    <option value="MR">MR</option>
                    <option value="M.">M.</option>
                    <option value="MME">MME</option>
                    <option value="MLE">MLE</option>
                    <option value="MLLE">MLLE</option>
                </select>
                <span class="form-label">Nom Prénom</span>
                <Input
                    name="name"
                    type="text"
                    required
                    autocomplete="on"
                    placeholder="Nom Prénom.."
                    onChange={updateField}
                    value={infos.name}
                />
            </label>
            <label class="full-field">
                <span class="form-label">Téléphone</span>
                <Input id="tel" name="tel" type="tel" onChange={updateField} placeholder="06 00 00 00 00" value={infos.tel} />
            </label>
            <label class="full-field">
                <span class="form-label">Email</span>
                <Input id="email" name="email" type="email" onChange={updateField} required placeholder="nom.prenom@example.com" value={infos.email}/>
            </label>
            
      </div>  
    );
}
