const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ward: String,
  room: String,
  status: { type: String, default: 'offline' },
  battery: Number,
  slotsUsed: Number,
  slotsTotal: Number,
  lastHeartbeat: String,
  // Merged IoT fields:
  firmwareVersion: String,
  lastSeen: Date,
  location: String
});

module.exports = mongoose.model('Device', schema);