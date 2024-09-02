const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');  // To generate random file names
const session = require('express-session');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(session({
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },  // Set secure to true if you're using HTTPS
}));



// Endpoint to mark experiment as completed
app.post('/complete-experiment', (req, res) => {
  // Access the received data
  const { prolificPID = 'Test 1', studyID = 'Test 2', sessionID = 'Test 3' } = req.body;

  // Now you can use these variables as needed, e.g., store them in a database
  console.log('Prolific PID:', prolificPID);
  console.log('Study ID:', studyID);
  console.log('Session ID:', sessionID);

  res.send('Experiment marked as completed');
});





// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to get the Image Paths
const getImagePaths = () => {
  const directoryPath = path.join(__dirname, 'public/img');
  try {
    const files = fs.readdirSync(directoryPath);
    const imagePaths = files.map(file => {
      return path.join('img', file);
    });
    return imagePaths;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

// Function to read filenames from the 'img' directory and store them in an array
const getFilenames = () => {
  const directoryPath = path.join(__dirname, 'public/img');
  try {
    const files = fs.readdirSync(directoryPath);
    const filenames = files.map(file => {
      let name = path.parse(file).name;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      name = name.replace(/-/g, ' '); // Replace dashes with spaces
      return name;
    });
    return filenames;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

// Endpoint to handle data submission and save each response as a separate JSON file
app.post('/submit-data', (req, res) => {
  // Extract variables from req.body
  const { prolificPID = 'Test 1', studyID = 'Test 2', sessionID = 'Test 3' } = req.body;

  // Generate the filename using the variables
  const randomFileName = `${prolificPID}_${studyID}_${sessionID}.json`;

  // Define the directory to save the files
  const directoryPath = path.join(__dirname, 'data');

  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write the data to a new file in the 'data' directory
  fs.writeFile(path.join(directoryPath, randomFileName), JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send('Failed to save data');
    } else {
      res.send('Data saved successfully');
    }
  });
});

// Endpoint to get image paths
app.get('/get-image-paths', (req, res) => {
  const imagePaths = getImagePaths();
  res.json(imagePaths);  // Send the image paths as a JSON response
});

// Endpoint to get the filenames
app.get('/get-filenames', (req, res) => {
  const filenames = getFilenames();
  res.json(filenames);
});

// Endpoint to get all data from the 'data' directory
app.get('/get-data', (req, res) => {
  const directoryPath = path.join(__dirname, 'data');
  try {
    const files = fs.readdirSync(directoryPath);
    const allData = files.map(file => {
      const fileData = fs.readFileSync(path.join(directoryPath, file), 'utf-8');
      return JSON.parse(fileData);
    });
    res.json(allData);
  } catch (err) {
    res.status(500).send('Failed to read data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
