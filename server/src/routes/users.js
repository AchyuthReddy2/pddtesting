const express = require('express');
const { authRequired, loadUser } = require('../middleware/auth');
const { formatUser } = require('../utils/userShape');

const router = express.Router();

router.get('/me', authRequired, loadUser, (req, res) => {
  res.json({ user: formatUser(req.user) });
});

router.patch('/me', authRequired, loadUser, async (req, res) => {
  const allowed = [
    'name', 'village', 'role', 'onboarded', 'lang', 'offline', 'notif',
    'fontScale', 'highContrast',
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});

router.post('/me/emergency-contacts', authRequired, loadUser, async (req, res) => {
  const { name, phone } = req.body;
  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Name and phone required' });
  }
  req.user.personalEmergencyContacts.push({ name: name.trim(), phone: phone.trim() });
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});

router.delete('/me/emergency-contacts/:contactId', authRequired, loadUser, async (req, res) => {
  req.user.personalEmergencyContacts = req.user.personalEmergencyContacts.filter(
    (c) => String(c._id) !== req.params.contactId
  );
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});

module.exports = router;
