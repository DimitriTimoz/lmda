const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  
app.listen(5001, () => {
    console.log('TODO: Settings for the server');
    console.log('Server started on port 5001');
});

