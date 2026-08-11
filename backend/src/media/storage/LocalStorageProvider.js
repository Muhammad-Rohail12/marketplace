const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const StorageProvider = require('./StorageProvider');

const ROOT = path.join(__dirname, '../../../../uploads/products');
const PUBLIC_PREFIX = '/uploads/products';

class LocalStorageProvider extends StorageProvider {
  // storageKey format: "<productId>/<generatedFilename>" — never the
  // original filename, and productId scoping keeps files organized
  // per-resource rather than dumped flat into one folder.
  async upload(buffer, { productId, extension }) {
    const dir = path.join(ROOT, String(productId));
    await fs.mkdir(dir, { recursive: true });

    const fileName = `${crypto.randomBytes(16).toString('hex')}${extension}`;
    const storageKey = `${productId}/${fileName}`;
    await fs.writeFile(path.join(ROOT, storageKey), buffer);

    return { storageKey, fileName };
  }

  async delete(storageKey) {
    try {
      await fs.unlink(this._safePath(storageKey));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  getUrl(storageKey) {
    return `${PUBLIC_PREFIX}/${storageKey}`;
  }

  async exists(storageKey) {
    try {
      await fs.access(this._safePath(storageKey));
      return true;
    } catch {
      return false;
    }
  }

  async replace(storageKey, buffer) {
    await fs.writeFile(this._safePath(storageKey), buffer);
  }

  // Resolves storageKey against ROOT and rejects any path that
  // escapes it — defends against a storageKey containing "../"
  // even though callers should never construct one manually.
  _safePath(storageKey) {
    const resolved = path.resolve(ROOT, storageKey);
    if (!resolved.startsWith(path.resolve(ROOT))) {
      throw new Error('Invalid storage key: path traversal detected');
    }
    return resolved;
  }
}

module.exports = LocalStorageProvider;