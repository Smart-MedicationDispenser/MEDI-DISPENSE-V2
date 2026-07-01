const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    // Fix Node.js c-ares DNS resolution issue on Windows
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected`);
    console.log(`✓ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[FATAL] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDatabase;
