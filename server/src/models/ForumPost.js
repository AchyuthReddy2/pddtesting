const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true, index: true },
    author: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ForumPost', schema);
