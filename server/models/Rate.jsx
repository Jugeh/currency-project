const mongoose = require('mongoose');

// Define a Mongoose schema for the rates
const rateSchema = new mongoose.Schema({
  name: String,
  code: String,
  alphaCode: String,
  numericCode: String,
  date: String,
  inverseRate: Number
});

// Create a Mongoose model from the schema
const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;