const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  firmwareVersion: { type: String },
  status: { type: String, default: 'offline' },
  lastSeen: { type: Date },
  batteryLevel: { type: Number },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);