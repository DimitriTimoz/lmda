const soap = require('soap');
const mondialRelay = require('mondial-relay');
const publicUrl = mondialRelay.publicUrl;
const apiUrl = mondialRelay.apiUrl;
const statusCodes = mondialRelay.statusCodes;
const securityKey = mondialRelay.securityKey;

const axios = require('axios');
const parser = require('xml2json');



async function creationExpedition(args) {
    args.Security = securityKey(Object.values(args));
    const client = await soap.createClientAsync(apiUrl);
    
    const objectBody = client.wsdl.objectToXML(args, 'ProspectType', '', '');
    const data = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <WSI2_CreationExpedition xmlns="http://www.mondialrelay.fr/webservice/">
    ${objectBody}</WSI2_CreationExpedition>
    </soap:Body>
  </soap:Envelope>`;
    
    const res = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'text/xml',
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI2_CreationExpedition"
      }
    });

    
    const obj = parser.toJson(res.data, { object: true });

    console.log(obj["soap:Envelope"]["soap:Body"].WSI2_CreationEtiquetteResponse);
    return obj;
  }
  

  /*
const creationExpedition = async (args) => {
    try {
        const client = await soap.createClientAsync(apiUrl);
        args.Security = securityKey(Object.values(args));
        
        const result = await client.WSI2_CreationExpedition(args);
        console.log(result);

        if (validateStatusCode(result.WSI2_CreationExpeditionResult.STAT)) {
            return result.WSI2_CreationExpeditionResult;
        } else {
            throw new Error(statusCodes[result.WSI2_CreationExpeditionResult.STAT]);
        }
    } catch (err) {
        throw err;
    }
}
*/

const fakeLabel = {
    Enseigne: "BDTEST13",
    ModeCol: "REL",
    ModeLiv: "24R",
    NDossier: "",
    NClient: "",
    Expe_Langage: "FR",
    Expe_Ad1: "MR",
    Expe_Ad2: "",
    Expe_Ad3: "10 Rue de la Paix",
    Expe_Ad4: "",
    Expe_Ville: "PARIS",
    Expe_CP: "75001",
    Expe_Pays: "FR",
    Expe_Tel1: "+33187653015",
    Expe_Tel2: "",
    Expe_Mail: "",
    Dest_Langage: "FR",
    Dest_Ad1: "MR",
    Dest_Ad2: "",
    Dest_Ad3: "10 Rue de la Paix",
    Dest_Ad4: "",
    Dest_Ville: "PARIS",
    Dest_CP: "75001",
    Dest_Pays: "FR",
    Dest_Tel1: "+33187653015",
    Dest_Tel2: "",
    Dest_Mail: "",
    Poids: "10",
    Longueur: "",
    Taille: "",
    NbColis: "1",
    CRT_Valeur: "100",
    CRT_Devise: "",
    Exp_Valeur: "",
    Exp_Devise: "",
    COL_Rel_Pays: "FR",
    COL_Rel: "AUTO",
    LIV_Rel_Pays: "FR",
    LIV_Rel: "FR-62049",
    TAvisage: "",
    TReprise: "",
    Montage: "",
    TRDV: "",
    Assurance: "",
    Instructions: "",
    Texte: ""
  }

module.exports = {
    creationExpedition,
    fakeLabel
};
