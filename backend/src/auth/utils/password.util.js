const bcrypt = require('bcrypt');
const authConfig = require('../config/auth.config');

const hashPassword = async (plainPassword) =>
  bcrypt.hash(plainPassword, authConfig.bcrypt.saltRounds);

const comparePassword = async (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

module.exports = { hashPassword, comparePassword };