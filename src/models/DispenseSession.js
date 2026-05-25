const mongoose = require('mongoose');

const dispenseSessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    triggerType: {
      type: String,
      enum: ['scheduled', 'manual', 'mqtt'],
      default: 'scheduled'
    },
    dispensedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DispenseEvent'
      }
    ],
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

dispenseSessionSchema.index({ patientId: 1, startedAt: -1 });
dispenseSessionSchema.index({ deviceId: 1, status: 1 });

module.exports = mongoose.model('DispenseSession', dispenseSessionSchema);