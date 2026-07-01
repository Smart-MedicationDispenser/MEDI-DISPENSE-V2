const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient: String,
  medication: String,
  deviceId: String,
  scheduledTime: String,
  status: String,
  priority: String
});

module.exports = mongoose.model('Verification', schema);
