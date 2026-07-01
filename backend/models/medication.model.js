const mongoose = require('mongoose');

<<<<<<< HEAD
const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  dosage: String,
  stock: Number,
  threshold: Number,
  expiry: String,
  status: String
});

module.exports = mongoose.model('Medication', schema);
=======
const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    tabletWeightMg: {
      type: Number,
      required: true
    },
    expectedMass: {
      type: Number,
      required: true
    },
    toleranceLower: {
      type: Number,
      default: 0.7
    },
    toleranceUpper: {
      type: Number,
      default: 1.3
    },
    yoloClassId: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
