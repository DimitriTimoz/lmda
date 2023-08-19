const axios = require('axios');
const path = require('path');
const fs = require('fs').promises; // Import the promises version of fs

async function sendEmail(email, subject, template, params = {}) {
    // Load the html template
    const templatePath = path.join(__dirname, '../emails', template + '.html');
    const templateFile = await fs.readFile(templatePath, 'utf-8');
    // Load the text template
    const textPath = path.join(__dirname, '../emails', template + '.txt');
    const textFile = await fs.readFile(textPath, 'utf-8'); 

    // Replace the params
    let html = templateFile;
    let text = textFile;
    for (const [key, value] of Object.entries(params)) {
        console.log(key, value);
        html = html.replace(`{{${key}}}`, value);
        text = text.replace(`{{${key}}}`, value);
    }

    const auth = {
        username: 'api',
        password: process.env.MAILGUN_API_KEY
    };

    const formData = new FormData();
    formData.append('from', 'Le Monde d\'Anna <mailgun@le-monde-de-anna.com>');
    formData.append('to', email);
    formData.append('subject', subject);
    formData.append('text', text);
    formData.append('html', html);

    try {
        const response = await axios.post('https://api.eu.mailgun.net/v3/le-monde-de-anna.com/messages', formData, {
            auth: auth,
        });

        return response.data.message == 'Queued. Thank you.';
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

module.exports = {
    sendEmail
};
