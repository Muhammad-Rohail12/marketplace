const config = require('../config');

const COLORS = {
  INFO: '\x1b[36m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
  DEBUG: '\x1b[35m',
  RESET: '\x1b[0m',
};

const timestamp = () => new Date().toISOString();

const write = (level, args) => {
  const color = COLORS[level] || '';
  console.log(`${color}[${level}]${COLORS.RESET} ${timestamp()}`, ...args);
};

const logger = {
  info: (...args) => write('INFO', args),
  warn: (...args) => write('WARN', args),
  error: (...args) => write('ERROR', args),
  debug: (...args) => {
    if (config.server.isDevelopment) write('DEBUG', args);
  },
};

module.exports = logger;