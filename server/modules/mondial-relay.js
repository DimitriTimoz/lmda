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

    
    let obj;
    try {
        obj = parser.toJson(res.data, { object: true });
    } catch (err) {
        throw err;
    }
    let response = obj["soap:Envelope"]["soap:Body"].WSI2_CreationExpeditionResponse;

    // Check status code
    if (response.WSI2_CreationExpeditionResult.STAT  !== "0") {
        throw [statusCodes[response.WSI2_CreationExpeditionResult.STAT], response.WSI2_CreationExpeditionResult.STAT];
    }
    // Get Url and num
    return response.WSI2_CreationExpeditionResult;
}
  

async function creationEtiquette(args) {
    args.Security = securityKey(Object.values(args));
    const client = await soap.createClientAsync(apiUrl);
    
    const objectBody = client.wsdl.objectToXML(args, 'ProspectType', '', '');
    const data = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <WSI2_CreationEtiquette xmlns="http://www.mondialrelay.fr/webservice/">
    ${objectBody}</WSI2_CreationEtiquette>
    </soap:Body>
  </soap:Envelope>`;
    
    const res = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'text/xml',
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI2_CreationEtiquette"
      }
    });

    
    let obj;
    try {
        obj = parser.toJson(res.data, { object: true });
    } catch (err) {
        throw err;
    }
    let response = obj["soap:Envelope"]["soap:Body"].WSI2_CreationEtiquetteResponse;

    // Check status code
    if (response.WSI2_CreationEtiquetteResult.STAT  !== "0") {
        throw [statusCodes[response.WSI2_CreationEtiquetteResult.STAT], response.WSI2_CreationEtiquetteResult.STAT];
    }

    // Get Url and num
    return {
        url: response.WSI2_CreationEtiquetteResult.URL_Etiquette,
        num: response.WSI2_CreationEtiquetteResult.NumExpedition
    }
}

let bodyLabel = {
  Enseigne: "CC22UXT2",
  ModeCol: "REL",
  ModeLiv: "24R",
  NDossier: "",
  NClient: "",
  Expe_Langage: "FR",
  Expe_Ad1: "Mme",
  Expe_Ad2: "",
  Expe_Ad3: "74 rue de l'ancienne poste",
  Expe_Ad4: "",
  Expe_Ville: "Franqueville saint pierre",
  Expe_CP: "76520",
  Expe_Pays: "FR",
  Expe_Tel1: "+33643281434",
  Expe_Tel2: "",
  Expe_Mail: "",
  Dest_Langage: "FR",
  Dest_Ad1: "",
  Dest_Ad2: "",
  Dest_Ad3: "",
  Dest_Ad4: "",
  Dest_Ville: "",
  Dest_CP: "",
  Dest_Pays: "FR",
  Dest_Tel1: "",
  Dest_Tel2: "",
  Dest_Mail: "",
  Poids: "10",
  Longueur: "",
  Taille: "",
  NbColis: "1",
  CRT_Valeur: "0",
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


let bodyTracking = {
  Enseigne: 'CC22UXT2',
  Expedition: '31236944',
  Langue: 'FR'
}

module.exports = {
    creationExpedition,
    creationEtiquette,
    bodyLabel,
    bodyTracking
};
