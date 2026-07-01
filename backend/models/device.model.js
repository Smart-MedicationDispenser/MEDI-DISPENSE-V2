const mongoose = require('mongoose');

<<<<<<< HEAD
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
=======
const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true
    },
    firmwareVersion: {
      type: String
    },
    status: {
      type: String,
      default: 'offline'
    },
    lastSeen: {
      type: Date
    },
    batteryLevel: {
      type: Number
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
