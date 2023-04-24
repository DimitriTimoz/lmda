const express = require('express');
const app = express();

// Serve the static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use(require('./routes'));

// Endpoint for handling API requests
app.get('/api', (req, res) => {
    res.send('API endpoint');
});
  
// Handles any requests that don't match the API endpoint
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
  
  
const port = process.env.PORT || 5001;
app.listen(port);

console.log(`App is listening on port ${port}`);

/*const { Pool } = require('pg');

const pool = new Pool({
  user: 'utilisateur',
  host: 'localhost',
  database: 'ma_base_de_donnees',
  password: 'mon_mot_de_passe',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});*/

