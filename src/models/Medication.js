const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },

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

}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);