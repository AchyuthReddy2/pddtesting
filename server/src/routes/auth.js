const express = require('express');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const { formatUser } = require('../utils/userShape');

const router = express.Router();
const STATIC_OTP = () => process.env.STATIC_OTP || '1234';

router.post('/send-otp', async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '');
  if (phone.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone required' });
  }
  res.json({ ok: true, message: 'OTP sent (demo: use 1234)' });
});

router.post('/verify-otp', async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '');
  const otp = String(req.body.otp || '').trim();
  if (phone.length < 10) return res.status(400).json({ error: 'Invalid phone' });
  if (otp !== STATIC_OTP()) return res.status(401).json({ error: 'Incorrect OTP' });

  const user = await User.findOne({ phone });
  if (user) {
    const token = signToken({ userId: String(user._id), phone });
    return res.json({ token, user: formatUser(user), needsSignup: false });
  }
  const token = signToken({ phone, pendingSignup: true }, '1h');
  res.json({ token, needsSignup: true });
});

router.post('/signup', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token required' });

  let payload;
  try {
    payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (!payload.pendingSignup || !payload.phone) {
    return res.status(400).json({ error: 'Complete OTP verification first' });
  }

  const { name, village, role, lang } = req.body;
  const existing = await User.findOne({ phone: payload.phone });
  if (existing) {
    const t = signToken({ userId: String(existing._id), phone: existing.phone });
    return res.json({ token: t, user: formatUser(existing) });
  }

  const user = await User.create({
    phone: payload.phone,
    name: (name || 'Villager').trim(),
    village: (village || 'Rampur').trim(),
    role: role === 'Sarpanch' ? 'Sarpanch' : 'Resident',
    lang: lang || 'en',
    onboarded: false,
  });
  const authToken = signToken({ userId: String(user._id), phone: user.phone });
  res.status(201).json({ token: authToken, user: formatUser(user) });
});

module.exports = router;
