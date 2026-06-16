const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set — DB features disabled');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed (IP not whitelisted?) — DB features disabled.');
    console.warn('   OTP via Gmail will still work.');
  }
}

module.exports = { connectDB };
