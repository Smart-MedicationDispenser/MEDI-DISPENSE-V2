const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: String,
  user: String,
  module: String,
  action: String,
  result: String
});

module.exports = mongoose.model('Audit', schema);
