const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientId: String,
  patientName: String,
  medication: String,
  dosage: String,
  frequency: String,
  startDate: String,
  endDate: String,
  doctor: String,
  status: String
});

module.exports = mongoose.model('Prescription', schema);
