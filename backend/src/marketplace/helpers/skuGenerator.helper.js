const crypto = require('crypto');

// Generates a human-scannable SKU: PREFIX-RANDOM, e.g. "TSHIRT-8F3K2Q".
// Uniqueness against the database is the caller's responsibility
// (retry-on-collision) once a real Product model exists.
const generateSku = (prefix = 'SKU') => {
  const cleanPrefix = prefix
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10) || 'SKU';

  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${cleanPrefix}-${suffix}`;
};

module.exports = { generateSku };