const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: String,
    author: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replyCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ForumThread', schema);
