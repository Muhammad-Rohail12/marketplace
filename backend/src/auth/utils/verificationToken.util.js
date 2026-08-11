const crypto = require('crypto');

// The raw token is emailed to the user; only its SHA-256 hash is
// stored in the database, so a leaked database never exposes usable
// verification links (same principle as password hashing).
const generateRawToken = () => crypto.randomBytes(32).toString('hex');

const hashToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = { generateRawToken, hashToken };