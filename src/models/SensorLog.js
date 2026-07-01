const mongoose = require('mongoose');

const sensorLogSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    sensorType: {
      type: String,
      enum: ['load_cell', 'ir', 'temperature', 'humidity', 'battery', 'heartbeat'],
      required: true
    },
    rawValue: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: null
    },
    slotNumber: {
      type: Number,
      default: null
    },
    mqttTopic: {
      type: String,
      default: null
    },
    isAnomaly: {
      type: Boolean,
      default: false
    },
    loggedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Retain sensor data for 90 days
sensorLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
sensorLogSchema.index({ deviceId: 1, sensorType: 1, loggedAt: -1 });

module.exports = mongoose.model('SensorLog', sensorLogSchema);