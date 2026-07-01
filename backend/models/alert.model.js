const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: String,
  patient: String,
  device: String,
  ward: String,
  desc: String,
  time: String,
  status: String,
  // Merged IoT fields:
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  message: String,
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: String,
  acknowledgedAt: Date,
  resolvedAt: Date
});

module.exports = mongoose.model('Alert', schema);