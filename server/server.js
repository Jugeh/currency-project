const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Rate = require('./models/Rate');
const path = require('path');

// Create Express server
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());
app.use("/",express.static(path.join(__dirname, 'client', 'currency_project', 'dist')));

// Connect to MongoDB
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url = "mongodb+srv://"+mongo_user+":"+mongo_password+"@testi.17wvver.mongodb.net/test?retryWrites=true&w=majority&appName=testi";

mongoose.connect(url)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'currency_project', 'dist', 'index.html'));
})

app.get('/rates', (req, res) => {
  axios.get('https://www.floatrates.com/daily/eur.json')
    .then(response => {
      // For each rate, check if it already exists in the database
      // If it doesn't exist, create a new document and insert it into the database
      Object.values(response.data).forEach(rate => {
        Rate.findOne({ code: rate.code, date: rate.date })
          .then(existingRate => {
            if (!existingRate) {
              const newRate = new Rate(rate);
              newRate.save()
                .then(() => console.log('Inserted rate into the database'))
                .catch(err => console.error('Error inserting rate:', err));
            }
          })
          .catch(err => console.error('Error finding rate:', err));
      });

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