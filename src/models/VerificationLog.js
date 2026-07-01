const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema(
  {
    dispenseEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DispenseEvent',
      default: null
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      default: null
    },
    method: {
      type: String,
      enum: ['weight', 'vision', 'both', 'manual'],
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    expectedQty: {
      type: Number,
      default: null
    },
    detectedQty: {
      type: Number,
      default: null
    },
    expectedWeightG: {
      type: Number,
      default: null
    },
    measuredWeightG: {
      type: Number,
      default: null
    },
    yoloConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    },
    failureReason: {
      type: String,
      enum: ['weight_mismatch', 'count_mismatch', 'wrong_tablet', 'sensor_error', null],
      default: null
    },
    imageRef: {
      type: String,
      default: null
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

verificationLogSchema.index({ deviceId: 1, verifiedAt: -1 });
verificationLogSchema.index({ passed: 1 });

module.exports = mongoose.model('VerificationLog', verificationLogSchema);