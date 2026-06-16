const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  label: String,
  phone: String,
  icon: String,
  color: String,
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('EmergencyContact', schema);
