const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient: String,
  medication: String,
  device: String,
  ward: String,
  time: String,
  status: String
});

module.exports = mongoose.model('DispenseJob', schema);
