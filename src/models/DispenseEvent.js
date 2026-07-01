// const mongoose = require("mongoose");

// const dispenseEventSchema = new mongoose.Schema(
// {
//   patientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Patient",
//     required: true
//   },

//   medicationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Medication",
//     required: true
//   },

//   deviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Device"
//   },

//   status: {
//     type: String,
//     enum: ["dispensed", "failed", "verification_failed"],
//     default: "dispensed"
//   },

//   verificationResult: {
//     type: Boolean,
//     default: true
//   },

//   dispensedAt: {
//     type: Date,
//     default: Date.now
//   }

// },
// { timestamps: true }
// );

// module.exports = mongoose.model("DispenseEvent", dispenseEventSchema);

const mongoose = require("mongoose");

const dispenseEventSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },

  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication"
  },

  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device"
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },

  status: {
    type: String,
    default: "dispensed"
  },

  dispensedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("DispenseEvent", dispenseEventSchema);