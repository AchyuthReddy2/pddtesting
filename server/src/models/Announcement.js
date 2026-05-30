const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    category: String,
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: String,
    color: String,
    icon: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', schema);
