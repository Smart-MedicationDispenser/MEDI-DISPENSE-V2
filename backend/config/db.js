const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medidispense';
    await mongoose.connect(uri);
    console.log('[backend] MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('[backend] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;