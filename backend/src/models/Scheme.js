const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  detail: String,
  fullDetail: String,
  type: { type: String, enum: ['Scheme', 'Health Camp'] },
  deadline: String,
  documents: [String],
  eligibility: String,
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('Scheme', schema);
