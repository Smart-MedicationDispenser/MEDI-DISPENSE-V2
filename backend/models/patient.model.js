const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number
    },
    gender: {
      type: String
    },
    bedNumber: {
      type: String
    },
    doctor: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);