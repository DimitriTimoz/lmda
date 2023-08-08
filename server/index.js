const express = require('express');
const app = express();
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

// Serve the static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());


app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);


app.use(require('./routes'));
  
// Handles any requests that don't match the API endpoint
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    // Skip this route for URLs starting with '/api'
    return next();
  }

  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
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
