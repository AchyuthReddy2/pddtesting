const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  { name: String, phone: String },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, index: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: 'Villager' },
    village: { type: String, default: 'Rampur' },
    role: { type: String, enum: ['Resident', 'Sarpanch'], default: 'Resident' },
    onboarded: { type: Boolean, default: false },
    lang: { type: String, default: 'en' },
    offline: { type: Boolean, default: false },
    notif: { type: Boolean, default: true },
    fontScale: { type: Number, default: 1 },
    highContrast: { type: Boolean, default: false },
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    schemeRSVPs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
    readThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread' }],
    personalEmergencyContacts: [emergencyContactSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
