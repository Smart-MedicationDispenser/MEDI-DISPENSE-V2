const mongoose = require('mongoose');

const dispenseSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication'
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot'
    },
    status: {
      type: String,
      enum: ['dispensed', 'failed', 'verification_failed'],
      default: 'dispensed'
    },
    dispensedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DispenseEvent', dispenseSchema);