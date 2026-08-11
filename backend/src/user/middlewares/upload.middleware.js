const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const FILE_UPLOAD = require('../../constants/fileUpload');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const UPLOAD_DIR = path.join(__dirname, '../../../../uploads/profile-images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${uniqueSuffix}${ext}`);
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

// Wraps multer's single-file upload to convert its errors (e.g. file
// too large) into the standard AppError flow instead of Express's
// default multer error shape.
const uploadProfileImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          `Image must be under ${FILE_UPLOAD.MAX_IMAGE_SIZE_MB}MB`,
          httpStatus.BAD_REQUEST,
          errorCodes.FILE_TOO_LARGE
        )
      );
    }
    if (err) return next(err);
    next();
  });
};

module.exports = { uploadProfileImage, UPLOAD_DIR };