const mongoose = require('mongoose');

<<<<<<< HEAD
const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  ward: String,
  medication: String,
  next: String,
  status: String
});

module.exports = mongoose.model('Patient', schema);
=======
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
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
