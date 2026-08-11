const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;

    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`,
      {
        requestId: req.requestId,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
      }
    );
  });

  next();
};

module.exports = requestLogger;