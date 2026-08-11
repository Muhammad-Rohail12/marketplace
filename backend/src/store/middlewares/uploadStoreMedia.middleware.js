const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const FILE_UPLOAD = require('../../constants/fileUpload');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

// Single shared directory, fieldname-prefixed filenames — same
// pattern as category-images (Phase 17). Kept behind this one
// middleware module so a future swap to Cloudinary/S3 only touches
// this file plus store.service.js's applyUploadedFiles helper.
const UPLOAD_DIR = path.join(__dirname, '../../../../uploads/store-media');
const PUBLIC_PATH_PREFIX = '/uploads/store-media';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(
      new AppError('Only JPEG, PNG, and WEBP images are allowed', httpStatus.BAD_REQUEST, errorCodes.INVALID_FILE_TYPE)
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_UPLOAD.MAX_IMAGE_SIZE_MB * 1024 * 1024 },
});

const uploadStoreMedia = (req, res, next) => {
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(`Images must be under ${FILE_UPLOAD.MAX_IMAGE_SIZE_MB}MB`, httpStatus.BAD_REQUEST, errorCodes.FILE_TOO_LARGE)
      );
    }
    if (err) return next(err);
    next();
  });
};

module.exports = { uploadStoreMedia, UPLOAD_DIR, PUBLIC_PATH_PREFIX };