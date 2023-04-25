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

const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'dbname',
  password: 'password',
  port: 5432,
});

pool.connect((connectErr, client, release) => {
  if (connectErr) {
    console.error('Error connecting to the database:', connectErr);
    return;
  }

  client.query('SELECT NOW()', (queryErr, res) => {
    release();
    
    if (queryErr) {
      console.error('Error executing query:', queryErr);
      return;
    }

    console.log('Current timestamp:', res.rows[0].now);
  });
});
