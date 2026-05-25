const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
{
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true
  },

  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication",
    required: true
  },

  slotNumber: {
    type: Number,
    required: true
  },

  totalCapacity: {
    type: Number,
    required: true
  },

  currentStock: {
    type: Number,
    required: true
  },

  lowStockThreshold: {
    type: Number,
    default: 5
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);