const FILE_UPLOAD = require('../../constants/fileUpload');

const isValidImageFile = (file) => {
  if (!file) return { isValid: false, message: 'No file provided' };
  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return { isValid: false, message: 'Only JPEG, PNG, and WEBP images are allowed' };
  }
  if (file.size > FILE_UPLOAD.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return { isValid: false, message: `Image must be under ${FILE_UPLOAD.MAX_IMAGE_SIZE_MB}MB` };
  }
  return { isValid: true, message: null };
};

module.exports = { isValidImageFile };