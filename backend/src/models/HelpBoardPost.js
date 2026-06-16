const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Need', 'Offer'], required: true },
    title: String,
    author: String,
    place: String,
    phone: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HelpBoardPost', schema);
