const mongoose = require('mongoose');

const ScrapRequestSchema = new mongoose.Schema({
  // Vehicle Details
  registration: { type: String },
  postcode: { type: String },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String },
  mileage: { type: String },

  // User Details
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  additionalInfo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ScrapRequest', ScrapRequestSchema);