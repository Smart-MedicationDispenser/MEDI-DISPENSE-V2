const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  hospitalName: String,
  wardCount: Number,
  deviceCount: Number,
  alertThresholds: {
    criticalStock: Number,
    lowStock: Number
  },
  dashboardRefreshInterval: Number,
  themePreference: String
});

module.exports = mongoose.model('Settings', schema);
