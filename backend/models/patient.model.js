const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  ward: String,
  medication: String,
  next: String,
  status: String
});

module.exports = mongoose.model('Patient', schema);
