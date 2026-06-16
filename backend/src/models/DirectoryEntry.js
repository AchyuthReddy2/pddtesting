const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  role: String,
  category: String,
  phone: String,
  icon: String,
  color: String,
  hours: String,
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('DirectoryEntry', schema);
