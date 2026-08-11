const path = require('path');
const sizeOf = require('image-size');
const FileType = require('file-type');
const MEDIA = require('../constants/media.constants');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

// Validates the ACTUAL file bytes (magic-number sniffing via
// file-type), never trusting the client-supplied mimetype or
// filename extension. Also enforces minimum marketplace-quality
// dimensions. Returns { extension, width, height } on success.
const validateImageBuffer = async (buffer, { requireMinDimensions = true } = {}) => {
  const detected = await FileType.fromBuffer(buffer);

  if (!detected || !MEDIA.ALLOWED_MIME_TYPES.includes(detected.mime)) {
    throw new AppError(
      'File content does not match an allowed image format (JPEG, PNG, WEBP)',
      httpStatus.BAD_REQUEST,
      errorCodes.INVALID_FILE_TYPE
    );
  }

  let dimensions;
  try {
    dimensions = sizeOf(buffer);
  } catch {
    throw new AppError('The uploaded file is not a valid or readable image', httpStatus.BAD_REQUEST, errorCodes.CORRUPTED_IMAGE);
  }

  if (requireMinDimensions && (dimensions.width < MEDIA.MIN_WIDTH_PX || dimensions.height < MEDIA.MIN_HEIGHT_PX)) {
    throw new AppError(
      `Image must be at least ${MEDIA.MIN_WIDTH_PX}x${MEDIA.MIN_HEIGHT_PX}px`,
      httpStatus.BAD_REQUEST,
      errorCodes.IMAGE_TOO_SMALL
    );
  }

  return { extension: `.${detected.ext}`, width: dimensions.width, height: dimensions.height, mimeType: detected.mime };
};

const validateMediaMetadataInput = (input = {}) => {
  const errors = [];
  const data = {};

  if (input.altText !== undefined) {
    const val = (input.altText || '').trim();
    if (val.length > MEDIA.ALT_TEXT_MAX) errors.push({ field: 'altText', message: `Must be under ${MEDIA.ALT_TEXT_MAX} characters` });
    else data.altText = val || null;
  }

  if (input.title !== undefined) {
    const val = (input.title || '').trim();
    if (val.length > MEDIA.TITLE_MAX) errors.push({ field: 'title', message: `Must be under ${MEDIA.TITLE_MAX} characters` });
    else data.title = val || null;
  }

  if (input.variantId !== undefined) {
    data.variantId = input.variantId === null || input.variantId === '' ? null : parseInt(input.variantId, 10);
  }

  return { isValid: errors.length === 0, errors, data };
};

const validateReorderInput = (input = {}) => {
  const order = Array.isArray(input.order) ? input.order : [];
  const cleaned = order.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
  if (!cleaned.length) {
    return { isValid: false, errors: [{ field: 'order', message: 'order must be a non-empty array of media IDs' }], data: [] };
  }
  return { isValid: true, errors: [], data: cleaned };
};

module.exports = { validateImageBuffer, validateMediaMetadataInput, validateReorderInput };