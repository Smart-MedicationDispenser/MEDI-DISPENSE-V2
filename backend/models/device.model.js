const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ward: String,
  room: String,
  status: String,
  battery: Number,
  slotsUsed: Number,
  slotsTotal: Number,
  lastHeartbeat: String
});

module.exports = mongoose.model('Device', schema);
