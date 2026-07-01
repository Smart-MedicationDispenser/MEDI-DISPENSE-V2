const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient: String,
  prescriptionId: String,
  medication: String,
  deviceId: String,
  time: String,
  status: String
});

module.exports = mongoose.model('Schedule', schema);
