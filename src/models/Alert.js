const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'low_stock',
        'refill',
        'critical',
        'device_offline',
        'missed_dose',
        'verification_failed',
        'expiry',
        'sensor_anomaly'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    message: {
      type: String,
      required: true
    },
    source: {
      deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        default: null
      },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
      },
      medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        default: null
      }
    },
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedBy: {
      type: String,
      default: null
    },
    acknowledgedAt: {
      type: Date,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Fast queries: unread high-severity alerts
alertSchema.index({ acknowledged: 1, severity: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);