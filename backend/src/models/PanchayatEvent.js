const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  place: String,
  icon: String,
  eventAt: Date,
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('PanchayatEvent', schema);
