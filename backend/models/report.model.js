const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: String,
  generatedAt: String,
  status: String,
  format: String
});

module.exports = mongoose.model('Report', schema);
