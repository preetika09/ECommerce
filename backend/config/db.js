const mongoose = require('mongoose');
const { autoSeedIfEmpty } = require('../utils/autoSeed');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopverse';
    
    // Attempt connecting to specified Mongo URI with a short timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting In-Memory MongoDB Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected successfully: ${conn.connection.host}`);
      await autoSeedIfEmpty();
    } catch (memErr) {
      console.error(`In-Memory MongoDB connection failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
