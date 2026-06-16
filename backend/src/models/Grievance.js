const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticketId: { type: String, unique: true },
    category: String,
    description: String,
    status: { type: String, enum: ['pending', 'inProgress', 'resolved'], default: 'pending' },
    photo: String,
    location: mongoose.Schema.Types.Mixed,
    response: String,
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grievance', schema);
