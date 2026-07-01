const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
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
      required: true,
      min: 1
    },
    totalCapacity: {
      type: Number,
      required: true
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    criticalThreshold: {
      type: Number,
      default: 2
    },
    expiryDate: {
      type: Date,
      default: null
    },
    batchNumber: {
      type: String,
      trim: true,
      default: null
    },
    lastRestockedAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

inventorySchema.index({ deviceId: 1, slotNumber: 1 }, { unique: true });

inventorySchema.virtual('isLowStock').get(function () {
  return this.currentStock <= this.lowStockThreshold;
});

inventorySchema.virtual('isCritical').get(function () {
  return this.currentStock <= this.criticalThreshold;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);