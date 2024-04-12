const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

// Create Express server
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());
app.use("/",express.static("public"));

// Connect to MongoDB
const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url = "mongodb+srv://"+mongo_user+":"+mongo_password+"@"+mongo_url+"?retryWrites=true&w=majority&appName=testi";

mongoose.connect(url)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Currency Exchange API');
});

app.get('/rates', (req, res) => {
  axios.get('https://www.floatrates.com/daily/usd.json')
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching exchange rates');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));