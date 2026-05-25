
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
{
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication",
    required: true
  },

  dosage: {
    type: Number,
    required: true
  },

  scheduleTime: {
    type: String,
    required: true
  },

  durationDays: {
    type: Number,
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
