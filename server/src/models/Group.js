const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  topic: String,
  members: { type: Number, default: 0 },
  icon: String,
  color: String,
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('Group', schema);
