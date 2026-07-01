const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  dosage: String,
  stock: Number,
  threshold: Number,
  expiry: String,
  status: String,
  // Merged IoT fields:
  tabletWeightMg: Number,
  expectedMass: Number,
  toleranceLower: { type: Number, default: 0.7 },
  toleranceUpper: { type: Number, default: 1.3 },
  yoloClassId: Number
});

module.exports = mongoose.model('Medication', schema);