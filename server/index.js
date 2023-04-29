const express = require('express');
const app = express();
const session = require('express-session');

// Serve the static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));


app.use(require('./routes'));
  
// Handles any requests that don't match the API endpoint
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
  
  
const port = process.env.PORT || 5001;
app.listen(port);

console.log(`App is listening on port ${port}`);

const pool = require('./db');

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
