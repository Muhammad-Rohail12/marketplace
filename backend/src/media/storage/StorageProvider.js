// Abstract interface — every concrete provider (Local, future
// Cloudinary/S3) must implement these five methods with this exact
// signature. Product/media services depend only on this interface,
// never on a concrete provider, so swapping providers later means
// writing one new file and changing one config value.
class StorageProvider {
  async upload(_buffer, _options) {
    throw new Error('upload() not implemented');
  }
  async delete(_storageKey) {
    throw new Error('delete() not implemented');
  }
  getUrl(_storageKey) {
    throw new Error('getUrl() not implemented');
  }
  async exists(_storageKey) {
    throw new Error('exists() not implemented');
  }
  async replace(_storageKey, _buffer, _options) {
    throw new Error('replace() not implemented');
  }
}

module.exports = StorageProvider;