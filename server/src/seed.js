/**
 * Seeds MongoDB Atlas with realistic village data.
 * Run: npm run seed  (from server/)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const DirectoryEntry = require('./models/DirectoryEntry');
const MarketItem = require('./models/MarketItem');
const Scheme = require('./models/Scheme');
const Group = require('./models/Group');
const ForumThread = require('./models/ForumThread');
const ForumPost = require('./models/ForumPost');
const Grievance = require('./models/Grievance');
const Notification = require('./models/Notification');
const HelpBoardPost = require('./models/HelpBoardPost');
const MandiPrice = require('./models/MandiPrice');
const PanchayatEvent = require('./models/PanchayatEvent');
const EmergencyContact = require('./models/EmergencyContact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected. Clearing collections…');

  await Promise.all([
    User.deleteMany({}),
    Announcement.deleteMany({}),
    DirectoryEntry.deleteMany({}),
    MarketItem.deleteMany({}),
    Scheme.deleteMany({}),
    Group.deleteMany({}),
    ForumThread.deleteMany({}),
    ForumPost.deleteMany({}),
    Grievance.deleteMany({}),
    Notification.deleteMany({}),
    HelpBoardPost.deleteMany({}),
    MandiPrice.deleteMany({}),
    PanchayatEvent.deleteMany({}),
    EmergencyContact.deleteMany({}),
  ]);

  const groups = await Group.insertMany([
    { name: 'Farmers Collective', topic: 'Crop prices, seeds, irrigation', members: 142, icon: 'leaf', color: '#1B5E3F', sortOrder: 1 },
    { name: 'Women Self-Help Group', topic: 'Savings, loans, tailoring', members: 89, icon: 'people', color: '#E8762B', sortOrder: 2 },
    { name: 'Youth & Jobs', topic: 'Skills, exams, opportunities', members: 64, icon: 'briefcase', color: '#2E7DA1', sortOrder: 3 },
    { name: 'Health & Wellness', topic: 'Camps, ASHA updates', members: 110, icon: 'fitness', color: '#C0392B', sortOrder: 4 },
  ]);

  const [g1, g2, g3, g4] = groups;

  const schemes = await Scheme.insertMany([
    {
      title: 'PM-KISAN Installment',
      detail: '6th installment of ₹2,000 credited. Check status with your Aadhaar at the CSP.',
      fullDetail: 'PM-KISAN provides income support of ₹6,000 per year to all landholding farmer families. The amount is paid in three equal installments of ₹2,000 every four months directly into bank accounts linked with Aadhaar.',
      type: 'Scheme',
      deadline: 'Ongoing',
      documents: ['Aadhaar card', 'Bank passbook', 'Land records'],
      eligibility: 'All landholding farmer families',
      sortOrder: 1,
    },
    {
      title: 'Free Eye Check-up Camp',
      detail: 'Cataract screening & free spectacles. Govt. School ground.',
      fullDetail: 'District Health Department is organizing a free eye check-up camp with cataract screening, free spectacles for eligible patients, and referral for surgery at district hospital.',
      type: 'Health Camp',
      deadline: 'Sat, 9 AM',
      documents: ['Aadhaar card', 'Previous prescription if any'],
      eligibility: 'All villagers, priority for senior citizens',
      sortOrder: 2,
    },
    {
      title: 'Ujjwala LPG Connection',
      detail: 'New gas connections for eligible BPL families. Bring ration card.',
      fullDetail: 'Pradhan Mantri Ujjwala Yojana provides free LPG connections to women from BPL households.',
      type: 'Scheme',
      deadline: '30 Jun',
      documents: ['BPL ration card', 'Aadhaar', 'Bank account'],
      eligibility: 'BPL women above 18 years',
      sortOrder: 3,
    },
    {
      title: 'Maternal Health Camp',
      detail: 'ANC check-ups and iron tablets for expecting mothers.',
      fullDetail: 'ASHA workers and ANM will conduct antenatal check-ups and distribute iron-folic acid tablets.',
      type: 'Health Camp',
      deadline: 'Wed, 10 AM',
      documents: ['MCP card if available', 'Aadhaar'],
      eligibility: 'Pregnant women in the village',
      sortOrder: 4,
    },
  ]);

  await Announcement.insertMany([
    { category: 'Panchayat', title: 'Gram Sabha meeting on Sunday', body: 'All residents are invited to the monthly Gram Sabha at the Panchayat Bhavan at 10:00 AM. Agenda includes water supply and the new road project.', author: 'Sarpanch Office', color: '#1B5E3F', icon: 'megaphone', createdAt: new Date(Date.now() - 2 * 3600000) },
    { category: 'Weather', title: 'Heavy rainfall alert for next 3 days', body: 'IMD has issued an orange alert. Farmers are advised to delay harvesting and secure stored grain.', author: 'Disaster Cell', color: '#2E7DA1', icon: 'rainy', createdAt: new Date(Date.now() - 5 * 3600000) },
    { category: 'Event', title: 'Free veterinary camp at the dairy', body: 'Vaccination and check-up for cattle and goats this Friday, 9 AM to 4 PM.', author: 'Animal Husbandry Dept', color: '#E8762B', icon: 'calendar', createdAt: new Date(Date.now() - 86400000) },
    { category: 'Water', title: 'Tank cleaning — supply off Tuesday', body: 'Overhead tank maintenance means no piped water on Tuesday from 6 AM to 2 PM.', author: 'Water Committee', color: '#7A5230', icon: 'water', createdAt: new Date(Date.now() - 86400000) },
    { category: 'Outage', title: 'Scheduled power cut — Thursday 2–6 PM', body: 'Transformer maintenance in the north hamlet. Charge phones beforehand.', author: 'Electricity Dept', color: '#D9A521', icon: 'flash-off', createdAt: new Date(Date.now() - 2 * 86400000) },
  ]);

  await DirectoryEntry.insertMany([
    { name: 'Primary Health Centre', role: 'Health Centre', category: 'Health', phone: '108', icon: 'medkit', color: '#C0392B', hours: '24/7', sortOrder: 1 },
    { name: 'Dr. Anita Rao', role: 'Village Doctor', category: 'Health', phone: '+919876543210', icon: 'medical', color: '#2E8B57', hours: '9 AM – 5 PM', sortOrder: 2 },
    { name: 'Govt. Primary School', role: 'School', category: 'Education', phone: '+919876511223', icon: 'school', color: '#2E7DA1', hours: '8 AM – 3 PM', sortOrder: 3 },
    { name: 'Police Station', role: 'Police', category: 'Emergency', phone: '100', icon: 'shield-checkmark', color: '#23291F', hours: '24/7', sortOrder: 4 },
    { name: 'Sarpanch — Ram Singh', role: 'Governance', category: 'Govt', phone: '+919876599887', icon: 'people', color: '#1B5E3F', hours: '10 AM – 6 PM', sortOrder: 5 },
    { name: 'Fair Price Shop', role: 'Ration Shop', category: 'Shops', phone: '+919876533445', icon: 'cart', color: '#E8762B', hours: '7 AM – 7 PM', sortOrder: 6 },
    { name: 'Bank Mitra (CSP)', role: 'Banking', category: 'Govt', phone: '+919876577665', icon: 'card', color: '#D9A521', hours: '9 AM – 5 PM', sortOrder: 7 },
    { name: 'Electricity Lineman', role: 'Utility', category: 'Govt', phone: '+919876522110', icon: 'flash', color: '#7A5230', hours: 'On call', sortOrder: 8 },
    { name: 'Village Pharmacy', role: 'Medical Store', category: 'Shops', phone: '+919876556667', icon: 'medical', color: '#8E44AD', hours: '8 AM – 9 PM', sortOrder: 9 },
    { name: 'Fire Station (Taluk)', role: 'Fire', category: 'Emergency', phone: '101', icon: 'flame', color: '#E8762B', hours: '24/7', sortOrder: 10 },
    { name: 'Ambulance (PHC)', role: 'Ambulance', category: 'Emergency', phone: '108', icon: 'medkit', color: '#C0392B', hours: '24/7', sortOrder: 11 },
    { name: 'Krishi Kendra', role: 'Seeds & Fertilizer', category: 'Shops', phone: '+919876588990', icon: 'leaf', color: '#1B5E3F', hours: '9 AM – 6 PM', sortOrder: 12 },
  ]);

  await MarketItem.insertMany([
    { title: 'Organic Wheat — 50 kg', price: '₹1,400', seller: 'Mohan Lal', place: 'East Hamlet', phone: '+919876543210', icon: 'nutrition', tag: 'Grain' },
    { title: 'Healthy Milch Cow', price: '₹38,000', seller: 'Sita Devi', place: 'Dairy Lane', phone: '+919876511223', icon: 'paw', tag: 'Livestock' },
    { title: 'Used Power Tiller', price: '₹62,000', seller: 'Kishan Coop', place: 'Main Road', phone: '+919876577665', icon: 'construct', tag: 'Equipment' },
    { title: 'Fresh Tomatoes — 20 kg', price: '₹600', seller: 'Lakshmi', place: 'West Field', phone: '+919876533445', icon: 'leaf', tag: 'Produce' },
    { title: 'Hand Pump Spare Set', price: '₹450', seller: 'Hardware Store', place: 'Bazaar', phone: '+919876522110', icon: 'build', tag: 'Equipment' },
    { title: 'Country Chickens (pair)', price: '₹900', seller: 'Ravi', place: 'North Hamlet', phone: '+919876598887', icon: 'egg', tag: 'Livestock' },
  ]);

  await MandiPrice.insertMany([
    { crop: 'Wheat', price: '₹2,150/qtl', change: '+2%', mandi: 'Rampur District Mandi', trend: 'up', sortOrder: 1 },
    { crop: 'Paddy', price: '₹1,980/qtl', change: '-1%', mandi: 'Rampur District Mandi', trend: 'down', sortOrder: 2 },
    { crop: 'Cotton', price: '₹6,200/qtl', change: '+5%', mandi: 'Rampur District Mandi', trend: 'up', sortOrder: 3 },
    { crop: 'Tomato', price: '₹18/kg', change: '-8%', mandi: 'Local Bazaar', trend: 'down', sortOrder: 4 },
    { crop: 'Onion', price: '₹22/kg', change: '+3%', mandi: 'Local Bazaar', trend: 'up', sortOrder: 5 },
    { crop: 'Soybean', price: '₹4,100/qtl', change: '0%', mandi: 'Rampur District Mandi', trend: 'flat', sortOrder: 6 },
  ]);

  await PanchayatEvent.insertMany([
    { title: 'Gram Sabha', date: 'Sun, 8 Jun', time: '10:00 AM', place: 'Panchayat Bhavan', icon: 'people', sortOrder: 1 },
    { title: 'Water Committee Meeting', date: 'Wed, 11 Jun', time: '4:00 PM', place: 'Community Hall', icon: 'water', sortOrder: 2 },
    { title: 'Ration Distribution Day', date: 'Fri, 13 Jun', time: '8:00 AM', place: 'Fair Price Shop', icon: 'cart', sortOrder: 3 },
    { title: 'Veterinary Camp', date: 'Fri, 20 Jun', time: '9:00 AM', place: 'Dairy Lane', icon: 'paw', sortOrder: 4 },
  ]);

  await EmergencyContact.insertMany([
    { label: 'Ambulance', phone: '108', icon: 'medkit', color: '#C0392B', sortOrder: 1 },
    { label: 'Police', phone: '100', icon: 'shield', color: '#23291F', sortOrder: 2 },
    { label: 'Fire', phone: '101', icon: 'flame', color: '#E8762B', sortOrder: 3 },
    { label: 'Women Helpline', phone: '1091', icon: 'female', color: '#8E44AD', sortOrder: 4 },
    { label: 'Disaster Mgmt', phone: '1077', icon: 'warning', color: '#D9A521', sortOrder: 5 },
    { label: 'Child Helpline', phone: '1098', icon: 'happy', color: '#2E8B57', sortOrder: 6 },
  ]);

  await HelpBoardPost.insertMany([
    { type: 'Need', title: 'Tractor for ploughing — 2 acres', author: 'Mohan Lal', place: 'East Hamlet', phone: '+919876543210', createdAt: new Date(Date.now() - 2 * 3600000) },
    { type: 'Offer', title: 'Daily farm labour available', author: 'Ravi', place: 'North Hamlet', phone: '+919876598887', createdAt: new Date(Date.now() - 5 * 3600000) },
    { type: 'Need', title: 'Transport for grain to mandi', author: 'Sita Devi', place: 'Dairy Lane', phone: '+919876511223', createdAt: new Date(Date.now() - 86400000) },
  ]);

  const threads = await ForumThread.insertMany([
    { groupId: g1._id, title: 'Best time to sow cotton this season?', author: 'Mohan Lal', replyCount: 3, createdAt: new Date(Date.now() - 3 * 3600000) },
    { groupId: g1._id, title: 'Drip irrigation subsidy — who applied?', author: 'Kishan Coop', replyCount: 2, createdAt: new Date(Date.now() - 86400000) },
    { groupId: g1._id, title: 'Tractor sharing for ploughing', author: 'Ravi', replyCount: 5, createdAt: new Date(Date.now() - 2 * 86400000) },
    { groupId: g2._id, title: 'New tailoring batch starting Monday', author: 'Sita Devi', replyCount: 2, createdAt: new Date(Date.now() - 5 * 3600000) },
    { groupId: g2._id, title: 'SHG loan repayment schedule', author: 'Lakshmi', replyCount: 1, createdAt: new Date(Date.now() - 86400000) },
    { groupId: g3._id, title: 'Police constable exam dates announced', author: 'Suresh', replyCount: 6, createdAt: new Date(Date.now() - 6 * 3600000) },
    { groupId: g3._id, title: 'Free computer course at ITI — register now', author: 'Youth Club', replyCount: 2, createdAt: new Date(Date.now() - 2 * 86400000) },
    { groupId: g4._id, title: 'ASHA visit schedule this week', author: 'ASHA Worker', replyCount: 2, createdAt: new Date(Date.now() - 4 * 3600000) },
    { groupId: g4._id, title: 'Tips for monsoon fever prevention', author: 'Dr. Anita Rao', replyCount: 4, createdAt: new Date(Date.now() - 86400000) },
  ]);

  const [t1, t4, t6] = threads;
  await ForumPost.insertMany([
    { threadId: t1._id, author: 'Mohan Lal', text: 'IMD says good rains expected. Should we wait another week before sowing?', createdAt: new Date(Date.now() - 3 * 3600000) },
    { threadId: t1._id, author: 'Ravi', text: 'We started last week in the east fields. Soil moisture is good.', createdAt: new Date(Date.now() - 2 * 3600000) },
    { threadId: t1._id, author: 'Kishan Coop', text: 'Krishi Kendra has new Bt cotton seeds at subsidized rates.', createdAt: new Date(Date.now() - 3600000) },
    { threadId: t4._id, author: 'Sita Devi', text: 'Free 3-month tailoring course for SHG members. Registration at the community hall.', createdAt: new Date(Date.now() - 5 * 3600000) },
    { threadId: t4._id, author: 'Lakshmi', text: 'I am interested! What documents are needed?', createdAt: new Date(Date.now() - 3 * 3600000) },
    { threadId: t6._id, author: 'Suresh', text: 'Application window opens June 15. Age limit 18–25.', createdAt: new Date(Date.now() - 6 * 3600000) },
    { threadId: t6._id, author: 'Arjun', text: 'Is there any coaching available in the district?', createdAt: new Date(Date.now() - 4 * 3600000) },
  ]);

  const demoUser = await User.create({
    phone: '9876543210',
    name: 'Suresh Kumar',
    village: 'Rampur',
    role: 'Resident',
    onboarded: true,
    lang: 'en',
    joinedGroups: [g1._id],
    schemeRSVPs: [schemes[0]._id],
    readThreads: [],
  });

  const sarpanch = await User.create({
    phone: '9876599887',
    name: 'Ram Singh',
    village: 'Rampur',
    role: 'Sarpanch',
    onboarded: true,
    joinedGroups: [g1._id, g2._id],
  });

  await Grievance.insertMany([
    {
      userId: demoUser._id,
      ticketId: 'VC-2025052401',
      category: 'Water Supply',
      description: 'No water in the south hamlet pipeline for 3 days.',
      status: 'inProgress',
      submittedAt: new Date(Date.now() - 3 * 86400000),
      response: 'Water committee has dispatched a repair team.',
    },
    {
      userId: demoUser._id,
      ticketId: 'VC-2025052602',
      category: 'Roads',
      description: 'Large pothole near the school gate, risky for children.',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000),
    },
  ]);

  await Notification.insertMany([
    { userId: demoUser._id, title: 'Gram Sabha reminder', body: 'Meeting tomorrow at 10 AM at the Panchayat Bhavan.', icon: 'megaphone', color: '#1B5E3F', read: false, createdAt: new Date(Date.now() - 3600000) },
    { userId: demoUser._id, title: 'Grievance update', body: 'Your water supply complaint is now In Progress.', icon: 'document-text', color: '#2E7DA1', read: false, createdAt: new Date(Date.now() - 4 * 3600000) },
    { userId: demoUser._id, title: 'New scheme available', body: 'PM-KISAN 6th installment has been credited.', icon: 'ribbon', color: '#D9A521', read: true, createdAt: new Date(Date.now() - 86400000) },
    { userId: demoUser._id, title: 'Weather alert', body: 'Heavy rainfall expected over the next 3 days.', icon: 'rainy', color: '#2E7DA1', read: true, createdAt: new Date(Date.now() - 86400000) },
  ]);

  console.log('Seed complete.');
  console.log('Demo login: phone 9876543210 | OTP 1234');
  console.log('Sarpanch login: phone 9876599887 | OTP 1234');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
