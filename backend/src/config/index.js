const app = require('./app.config');
const server = require('./server.config');
const database = require('./database.config');
const security = require('./security.config');
const email = require('./email.config');

module.exports = { app, server, database, security, email };