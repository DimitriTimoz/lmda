const express = require('express');
const app = express();

// Serve the static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

// Endpoint for handling API requests
app.get('/api', (req, res) => {
    res.send('API endpoint');
});
  
// Handles any requests that don't match the API endpoint
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});
  
  
const port = process.env.PORT || 5001;
app.listen(port);

console.log(`App is listening on port ${port}`);
