const app = require('./app');
const config = require('./config');
const prisma = require('./database/prismaClient');
const logger = require('./utils/logger');

let server;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully.');

    server = app.listen(config.server.port, () => {
      logger.info(`Marketplace API running on http://localhost:${config.server.port}`);
      logger.info(`Environment: ${config.server.nodeEnv}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    logger.info('Prisma disconnected.');
  } catch (err) {
    logger.error('Error disconnecting Prisma:', err);
  } finally {
    process.exit(0);
  }
};

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
      disconnectPrisma();
    });
  } else {
    disconnectPrisma();
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();

module.exports = server;