const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: String,
  patient: String,
  device: String,
  ward: String,
  desc: String,
  time: String,
  status: String
});

module.exports = mongoose.model('Alert', schema);
