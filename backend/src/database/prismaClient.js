const config = require('../config');
const { PrismaClient } = require('@prisma/client');

// Prevent multiple PrismaClient instances during development
// (nodemon hot-reloads modules, which would otherwise create a new
// connection pool on every file change).
let prisma;

if (config.server.isProduction) {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;