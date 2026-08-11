const LocalStorageProvider = require('./LocalStorageProvider');

// Single switch point for the storage backend. Swapping to
// Cloudinary/S3 later means: write CloudinaryStorageProvider.js
// implementing the same StorageProvider interface, then change this
// one line (driven by an env var) — no other file in the app changes.
const DRIVER = process.env.MEDIA_STORAGE_DRIVER || 'local';

const providers = {
  local: () => new LocalStorageProvider(),
};

if (!providers[DRIVER]) {
  throw new Error(`Unknown MEDIA_STORAGE_DRIVER: ${DRIVER}`);
}

module.exports = providers[DRIVER]();