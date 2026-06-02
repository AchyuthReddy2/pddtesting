const express = require('express');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const { formatUser } = require('../utils/userShape');
const { sendOtpEmail } = require('../utils/mailer');
const { generateOtp, saveOtp, verifyOtp } = require('../utils/otpStore');

const router = express.Router();
const STATIC_OTP = process.env.STATIC_OTP || '';
const allowStaticOtp = process.env.NODE_ENV !== 'production' && !!STATIC_OTP;

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

router.post('/send-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const otp = generateOtp();
  saveOtp(email, otp);

  if (allowStaticOtp) {
    // Optional fallback in environments where SMTP is not configured yet.
    saveOtp(email, STATIC_OTP);
    return res.json({ ok: true, message: `OTP sent (dev OTP: ${STATIC_OTP})` });
  }

  try {
    await sendOtpEmail(email, otp);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Could not send OTP email' });
  }
  res.json({ ok: true, message: 'OTP sent to your email' });
});

router.post('/verify-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  if (!verifyOtp(email, otp)) return res.status(401).json({ error: 'Incorrect or expired OTP' });

  const user = await User.findOne({ email });
  if (user) {
    const token = signToken({ userId: String(user._id), email });
    return res.json({ token, user: formatUser(user), needsSignup: false });
  }
  const token = signToken({ email, pendingSignup: true }, '1h');
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
  if (!payload.pendingSignup || !payload.email) {
    return res.status(400).json({ error: 'Complete OTP verification first' });
  }

  const { name, village, role, lang, phone } = req.body;
  const phoneValue = String(phone || '').replace(/\D/g, '');
  if (phoneValue.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone required' });
  }

  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    const t = signToken({ userId: String(existing._id), email: existing.email });
    return res.json({ token: t, user: formatUser(existing) });
  }

  const user = await User.create({
    email: payload.email,
    phone: phoneValue,
    name: (name || 'Villager').trim(),
    village: (village || 'Rampur').trim(),
    role: role === 'Sarpanch' ? 'Sarpanch' : 'Resident',
    lang: lang || 'en',
    onboarded: false,
  });
  const authToken = signToken({ userId: String(user._id), email: user.email });
  res.status(201).json({ token: authToken, user: formatUser(user) });
});

module.exports = router;
