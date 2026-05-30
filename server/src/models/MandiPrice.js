const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  crop: String,
  price: String,
  change: String,
  mandi: String,
  trend: { type: String, enum: ['up', 'down', 'flat'], default: 'flat' },
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('MandiPrice', schema);
