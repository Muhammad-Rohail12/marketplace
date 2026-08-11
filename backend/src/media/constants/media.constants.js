module.exports = {
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  MAX_FILE_SIZE_MB: Number(process.env.MEDIA_MAX_FILE_SIZE_MB) || 8,
  MAX_IMAGES_PER_PRODUCT: Number(process.env.MEDIA_MAX_IMAGES_PER_PRODUCT) || 12,
  MIN_WIDTH_PX: 400,
  MIN_HEIGHT_PX: 400,
  ALT_TEXT_MAX: 200,
  TITLE_MAX: 150,
};