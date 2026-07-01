const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  dosage: String,
  stock: Number,
  threshold: Number,
  expiry: String,
  status: String
});

module.exports = mongoose.model('Medication', schema);
