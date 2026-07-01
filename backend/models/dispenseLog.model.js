const mongoose = require('mongoose');

const dispenseLogSchema = new mongoose.Schema(
  {
    dispenseEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DispenseEvent',
      required: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: true
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    slotNumber: {
      type: Number,
      default: null
    },
    dispensedQty: {
      type: Number,
      required: true
    },
    measuredWeightG: {
      type: Number,
      default: null
    },
    verificationPassed: {
      type: Boolean,
      default: null
    },
    verificationMethod: {
      type: String,
      enum: ['weight', 'vision', 'both', 'none'],
      default: 'none'
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'partial', 'skipped'],
      default: 'success'
    },
    notes: {
      type: String,
      default: null
    },
    loggedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Retain logs for 1 year
dispenseLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });
dispenseLogSchema.index({ patientId: 1, loggedAt: -1 });

module.exports = mongoose.model('DispenseLog', dispenseLogSchema);