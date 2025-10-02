try {
  const logger = require('./utils/logger');
  logger.info('Bootstrapping AstroUp backend...');
  const app = require('./app');
  const socket = require('./config/socket');
  const PORT = process.env.PORT || 5000;
  const ENV = process.env.NODE_ENV || 'development';
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${ENV} mode`);
  }).on('error', (err) => {
    logger.error('Server failed to start:', err);
    console.error('Server startup error:', err);
    process.exit(1);
  });

  try {
    socket.initialize(server);
    logger.info('Socket.IO initialized successfully');
  } catch (err) {
    logger.error('Socket.IO initialization failed:', err);
    console.error('Socket.IO error:', err);
  }

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, err);
    console.error('Unhandled rejection:', err);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err);
    console.error('Uncaught exception:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Critical Startup Error:', err);
  process.exit(1);
}