const mongoose = require('mongoose');
const logger = require('../utils/logger');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected...');
    logger.info('applyGlobalPlugins with pagination v2...');
  } catch (err) {
    logger.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
