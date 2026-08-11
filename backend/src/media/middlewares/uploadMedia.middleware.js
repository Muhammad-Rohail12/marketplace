const multer = require('multer');
const MEDIA = require('../constants/media.constants');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

// Deliberately memoryStorage, not diskStorage: the buffer is content-
// sniffed (media.validator.js) BEFORE anything is ever written to
// disk. A file that fails validation never touches the filesystem at
// all — the local disk write only happens inside the storage
// provider, after validation succeeds.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MEDIA.MAX_FILE_SIZE_MB * 1024 * 1024, files: 10 },
});

const uploadMediaFiles = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`Each image must be under ${MEDIA.MAX_FILE_SIZE_MB}MB`, httpStatus.BAD_REQUEST, errorCodes.FILE_TOO_LARGE));
    }
    if (err) return next(err);
    next();
  });
};

module.exports = { uploadMediaFiles };