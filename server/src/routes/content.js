const express = require('express');
const Announcement = require('../models/Announcement');
const DirectoryEntry = require('../models/DirectoryEntry');
const MarketItem = require('../models/MarketItem');
const Scheme = require('../models/Scheme');
const Group = require('../models/Group');
const ForumThread = require('../models/ForumThread');
const ForumPost = require('../models/ForumPost');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');
const User = require('../models/User');
const HelpBoardPost = require('../models/HelpBoardPost');
const MandiPrice = require('../models/MandiPrice');
const PanchayatEvent = require('../models/PanchayatEvent');
const EmergencyContact = require('../models/EmergencyContact');
const { authRequired, loadUser } = require('../middleware/auth');
const { toJSON, formatRelativeTime } = require('../utils/serialize');
const { makeTicketId, progressGrievance } = require('../utils/grievance');
const { formatUser } = require('../utils/userShape');

const router = express.Router();

function mapAnnouncement(a) {
  const j = toJSON(a);
  j.time = formatRelativeTime(a.createdAt);
  return j;
}

function mapMarket(m) {
  const j = toJSON(m);
  return j;
}

function mapHelp(h) {
  const j = toJSON(h);
  j.time = formatRelativeTime(h.createdAt);
  return j;
}

function mapThread(t) {
  const j = toJSON(t);
  j.groupId = String(t.groupId);
  j.time = formatRelativeTime(t.createdAt);
  j.replies = t.replyCount || 0;
  return j;
}

function mapPost(p) {
  const j = toJSON(p);
  j.time = formatRelativeTime(p.createdAt);
  return j;
}

function mapGrievance(g) {
  const progressed = progressGrievance(g);
  const j = toJSON(progressed);
  j.date = new Date(progressed.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  j.submittedAt = new Date(progressed.submittedAt).getTime();
  if (g.userId && typeof g.userId === 'object' && g.userId._id) {
    j.reporterName = g.userId.name;
    j.reporterPhone = g.userId.phone;
    j.reporterVillage = g.userId.village;
    j.userId = String(g.userId._id);
  } else if (g.userId) {
    j.userId = String(g.userId);
  }
  return j;
}

async function notifySarpanchs(title, body, icon = 'document-text', color = '#E8762B', excludeUserId) {
  const sarpanchs = await User.find({ role: 'Sarpanch' });
  await Promise.all(
    sarpanchs
      .filter((s) => !excludeUserId || String(s._id) !== String(excludeUserId))
      .map((s) => notifyUser(s._id, title, body, icon, color))
  );
}

async function notifyUser(userId, title, body, icon = 'notifications', color = '#1B5E3F') {
  await Notification.create({ userId, title, body, icon, color, read: false });
}

// ——— Public reads ———
router.get('/announcements', async (req, res) => {
  const list = await Announcement.find().sort({ createdAt: -1 }).limit(100);
  res.json(list.map(mapAnnouncement));
});

router.get('/directory', async (req, res) => {
  const list = await DirectoryEntry.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/market', async (req, res) => {
  const list = await MarketItem.find().sort({ createdAt: -1 });
  res.json(list.map(mapMarket));
});

router.get('/schemes', async (req, res) => {
  const list = await Scheme.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/schemes/:id', async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Not found' });
  res.json(toJSON(scheme));
});

router.get('/groups', async (req, res) => {
  const list = await Group.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/groups/:groupId/threads', async (req, res) => {
  const list = await ForumThread.find({ groupId: req.params.groupId }).sort({ updatedAt: -1 });
  res.json(list.map(mapThread));
});

router.get('/threads/:threadId', async (req, res) => {
  const thread = await ForumThread.findById(req.params.threadId);
  if (!thread) return res.status(404).json({ error: 'Not found' });
  res.json(mapThread(thread));
});

router.get('/threads/:threadId/posts', async (req, res) => {
  const list = await ForumPost.find({ threadId: req.params.threadId }).sort({ createdAt: 1 });
  res.json(list.map(mapPost));
});

router.get('/mandi-prices', async (req, res) => {
  const list = await MandiPrice.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/calendar', async (req, res) => {
  const list = await PanchayatEvent.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/emergency-contacts', async (req, res) => {
  const list = await EmergencyContact.find().sort({ sortOrder: 1 });
  res.json(toJSON(list));
});

router.get('/help-board', async (req, res) => {
  const list = await HelpBoardPost.find().sort({ createdAt: -1 });
  res.json(list.map(mapHelp));
});

router.get('/config', (req, res) => {
  res.json({
    directoryCategories: ['All', 'Health', 'Education', 'Shops', 'Emergency', 'Govt'],
    marketTags: ['Grain', 'Produce', 'Livestock', 'Equipment'],
    grievanceCategories: [
      { id: 'c1', label: 'Water Supply', icon: 'water' },
      { id: 'c2', label: 'Electricity', icon: 'flash' },
      { id: 'c3', label: 'Roads', icon: 'trail-sign' },
      { id: 'c4', label: 'Sanitation', icon: 'trash' },
      { id: 'c5', label: 'Health', icon: 'medkit' },
      { id: 'c6', label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  });
});

// ——— Auth required ———
router.get('/bootstrap', authRequired, loadUser, async (req, res) => {
  const userId = req.user._id;
  const [announcements, directory, marketItems, schemes, groups, mandiPrices, calendar, helpBoard, emergencyContacts, grievances, notifications] =
    await Promise.all([
      Announcement.find().sort({ createdAt: -1 }).limit(50),
      DirectoryEntry.find().sort({ sortOrder: 1 }),
      MarketItem.find().sort({ createdAt: -1 }),
      Scheme.find().sort({ sortOrder: 1 }),
      Group.find().sort({ sortOrder: 1 }),
      MandiPrice.find().sort({ sortOrder: 1 }),
      PanchayatEvent.find().sort({ sortOrder: 1 }),
      HelpBoardPost.find().sort({ createdAt: -1 }),
      EmergencyContact.find().sort({ sortOrder: 1 }),
      Grievance.find({ userId }).sort({ createdAt: -1 }),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(50),
    ]);

  const joinedGroupIds = req.user.joinedGroups.map(String);
  const threads = await ForumThread.find({ groupId: { $in: req.user.joinedGroups } });
  const threadIds = threads.map((t) => t._id);
  const posts = await ForumPost.find({ threadId: { $in: threadIds } });
  const forumPosts = {};
  posts.forEach((p) => {
    const tid = String(p.threadId);
    if (!forumPosts[tid]) forumPosts[tid] = [];
    forumPosts[tid].push(mapPost(p));
  });

  res.json({
    user: formatUser(req.user),
    announcements: announcements.map(mapAnnouncement),
    directory: toJSON(directory),
    marketItems: marketItems.map(mapMarket),
    schemes: toJSON(schemes),
    groups: toJSON(groups),
    mandiPrices: toJSON(mandiPrices),
    panchayatCalendar: toJSON(calendar),
    helpBoard: helpBoard.map(mapHelp),
    emergencyContacts: toJSON(emergencyContacts),
    grievances: grievances.map(mapGrievance),
    villageGrievances:
      req.user.role === 'Sarpanch'
        ? (await Grievance.find().populate('userId', 'name phone village role').sort({ createdAt: -1 })).map(mapGrievance)
        : [],
    notifications: notifications.map((n) => {
      const j = toJSON(n);
      j.time = formatRelativeTime(n.createdAt);
      return j;
    }),
    forumPosts,
    forumThreads: threads.map(mapThread),
  });
});

router.post('/announcements', authRequired, loadUser, async (req, res) => {
  if (req.user.role !== 'Sarpanch') {
    return res.status(403).json({ error: 'Only Sarpanch can post announcements' });
  }
  const { category, title, body, color, icon } = req.body;
  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: 'Title and body required' });
  }
  const ann = await Announcement.create({
    category: category || 'Panchayat',
    title: title.trim(),
    body: body.trim(),
    author: req.user.name,
    authorId: req.user._id,
    color: color || '#1B5E3F',
    icon: icon || 'megaphone',
  });
  res.status(201).json(mapAnnouncement(ann));
});

router.post('/market', authRequired, loadUser, async (req, res) => {
  const { title, price, place, phone, tag } = req.body;
  if (!title?.trim() || !price?.trim()) {
    return res.status(400).json({ error: 'Title and price required' });
  }
  const item = await MarketItem.create({
    title: title.trim(),
    price: price.startsWith('₹') ? price : `₹${price}`,
    seller: req.user.name,
    place: place || req.user.village,
    phone: phone || req.user.phone,
    tag: tag || 'Produce',
    sellerId: req.user._id,
  });
  res.status(201).json(mapMarket(item));
});

router.post('/grievances', authRequired, loadUser, async (req, res) => {
  const { category, description, photo, location } = req.body;
  if (!category || !description?.trim()) {
    return res.status(400).json({ error: 'Category and description required' });
  }
  const g = await Grievance.create({
    userId: req.user._id,
    ticketId: makeTicketId(),
    category,
    description: description.trim(),
    photo: photo || null,
    location: location || null,
    status: 'pending',
    submittedAt: new Date(),
  });
  await notifyUser(req.user._id, 'Grievance submitted', `Ticket ${g.ticketId} — ${category}`, 'document-text', '#2E7DA1');
  await notifySarpanchs(
    'New village complaint',
    `${req.user.name} (${req.user.village}): ${category} — ${description.trim().slice(0, 100)}`,
    'document-text',
    '#E8762B',
    req.user._id
  );
  res.status(201).json(mapGrievance(g));
});

router.get('/grievances', authRequired, loadUser, async (req, res) => {
  const list = await Grievance.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(list.map(mapGrievance));
});

router.get('/grievances/village', authRequired, loadUser, async (req, res) => {
  if (req.user.role !== 'Sarpanch') {
    return res.status(403).json({ error: 'Only Sarpanch can view village complaints' });
  }
  const list = await Grievance.find()
    .populate('userId', 'name phone village role')
    .sort({ createdAt: -1 });
  res.json(list.map(mapGrievance));
});

router.patch('/grievances/:id', authRequired, loadUser, async (req, res) => {
  if (req.user.role !== 'Sarpanch') {
    return res.status(403).json({ error: 'Only Sarpanch can update complaints' });
  }
  const { status, response } = req.body;
  const allowed = ['pending', 'inProgress', 'resolved'];
  if (status && !allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const g = await Grievance.findById(req.params.id).populate('userId', 'name phone village');
  if (!g) return res.status(404).json({ error: 'Complaint not found' });

  if (status) g.status = status;
  if (response != null) g.response = response.trim() || g.response;

  await g.save();

  if (g.userId?._id) {
    const statusLabel = g.status === 'resolved' ? 'Resolved' : g.status === 'inProgress' ? 'In Progress' : 'Pending';
    await notifyUser(
      g.userId._id,
      'Grievance update',
      `Ticket ${g.ticketId} is now ${statusLabel}.${g.response ? ` Response: ${g.response}` : ''}`,
      'document-text',
      '#2E7DA1'
    );
  }

  res.json(mapGrievance(g));
});

router.get('/notifications', authRequired, loadUser, async (req, res) => {
  const list = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(
    list.map((n) => {
      const j = toJSON(n);
      j.time = formatRelativeTime(n.createdAt);
      return j;
    })
  );
});

router.patch('/notifications/read-all', authRequired, loadUser, async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  const list = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(
    list.map((n) => {
      const j = toJSON(n);
      j.time = formatRelativeTime(n.createdAt);
      return j;
    })
  );
});

router.post('/help-board', authRequired, loadUser, async (req, res) => {
  const { type, title, place, phone } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  const post = await HelpBoardPost.create({
    type: type === 'Offer' ? 'Offer' : 'Need',
    title: title.trim(),
    author: req.user.name,
    place: place || req.user.village,
    phone: phone || req.user.phone,
    authorId: req.user._id,
  });
  res.status(201).json(mapHelp(post));
});

router.post('/groups/:groupId/join', authRequired, loadUser, async (req, res) => {
  const gid = req.params.groupId;
  const group = await Group.findById(gid);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!req.user.joinedGroups.some((id) => String(id) === gid)) {
    req.user.joinedGroups.push(group._id);
    group.members += 1;
    await Promise.all([req.user.save(), group.save()]);
  }
  res.json({ user: formatUser(req.user) });
});

router.post('/groups/:groupId/leave', authRequired, loadUser, async (req, res) => {
  const gid = req.params.groupId;
  const group = await Group.findById(gid);
  req.user.joinedGroups = req.user.joinedGroups.filter((id) => String(id) !== gid);
  if (group && group.members > 0) group.members -= 1;
  await Promise.all([req.user.save(), group?.save()]);
  res.json({ user: formatUser(req.user) });
});

router.post('/schemes/:schemeId/rsvp', authRequired, loadUser, async (req, res) => {
  const sid = req.params.schemeId;
  const idx = req.user.schemeRSVPs.findIndex((id) => String(id) === sid);
  if (idx >= 0) req.user.schemeRSVPs.splice(idx, 1);
  else req.user.schemeRSVPs.push(sid);
  await req.user.save();
  res.json({ user: formatUser(req.user) });
});

router.post('/threads/:threadId/posts', authRequired, loadUser, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Reply text required' });
  const thread = await ForumThread.findById(req.params.threadId);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  const post = await ForumPost.create({
    threadId: thread._id,
    author: req.user.name,
    authorId: req.user._id,
    text: text.trim(),
  });
  thread.replyCount = (thread.replyCount || 0) + 1;
  await thread.save();
  req.user.readThreads = req.user.readThreads.filter((id) => String(id) !== String(thread._id));
  await req.user.save();
  res.status(201).json(mapPost(post));
});

router.post('/threads/:threadId/read', authRequired, loadUser, async (req, res) => {
  const tid = req.params.threadId;
  if (!req.user.readThreads.some((id) => String(id) === tid)) {
    req.user.readThreads.push(tid);
    await req.user.save();
  }
  res.json({ user: formatUser(req.user) });
});

module.exports = router;
