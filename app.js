require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});
const logger = require('./utils/logger');
logger.warn(`dotenv loaded for environment: ${process.env.NODE_ENV || 'default'}`);
const express = require('express');
const corsMiddleware = require('./config/cors');
const runSeeder = require('./seeder/index')
const connectDB = require('./config/db');
const routes = require('./routes');
const { getHomeInfo } = require('./home/homeService');
const app = express();
app.use(express.static(__dirname + "/public"));
const initializeDB = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connected successfully...');
    await runSeeder();
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

initializeDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);
app.get("/", async (req, res) => {
  const result = await getHomeInfo();
  const statusCode = result.success ? 200 : 500;
  res.status(statusCode).json(result);
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;