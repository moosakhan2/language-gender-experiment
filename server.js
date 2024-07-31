const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to handle data submission
app.post('/submit-data', (req, res) => {
  const data = req.body;
  fs.readFile('data.json', (err, fileData) => {
    let json = [];
    if (!err) {
      json = JSON.parse(fileData);
    }
    json.push(data);
    fs.writeFile('data.json', JSON.stringify(json, null, 2), (err) => {
      if (err) {
        res.status(500).send('Failed to save data');
      } else {
        res.send('Data saved successfully');
      }
    });
  });
});

// Endpoint to get data
app.get('/get-data', (req, res) => {
  fs.readFile('data.json', (err, fileData) => {
    if (err) {
      res.status(500).send('Failed to read data');
    } else {
      res.send(fileData);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
