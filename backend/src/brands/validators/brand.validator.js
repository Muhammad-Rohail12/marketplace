const BRAND = require('../constants/brand.constants');
const { isValidUrl } = require('../../utils/validation');

const parseBoolean = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
};

const validateBrandInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) {
      errors.push({ field: 'name', message: 'Brand name is required' });
    } else if (name.length < BRAND.NAME_MIN_LENGTH || name.length > BRAND.NAME_MAX_LENGTH) {
      errors.push({
        field: 'name',
        message: `Name must be between ${BRAND.NAME_MIN_LENGTH} and ${BRAND.NAME_MAX_LENGTH} characters`,
      });
    } else {
      data.name = name;
    }
  }

  if (input.shortDescription !== undefined) {
    const shortDescription = (input.shortDescription || '').trim();
    if (shortDescription.length > BRAND.SHORT_DESCRIPTION_MAX_LENGTH) {
      errors.push({
        field: 'shortDescription',
        message: `Short description must be under ${BRAND.SHORT_DESCRIPTION_MAX_LENGTH} characters`,
      });
    } else {
      data.shortDescription = shortDescription || null;
    }
  }

  if (input.description !== undefined) {
    const description = (input.description || '').trim();
    if (description.length > BRAND.DESCRIPTION_MAX_LENGTH) {
      errors.push({ field: 'description', message: `Description must be under ${BRAND.DESCRIPTION_MAX_LENGTH} characters` });
    } else {
      data.description = description || null;
    }
  }

  if (input.websiteUrl !== undefined) {
    const websiteUrl = (input.websiteUrl || '').trim();
    if (websiteUrl && !isValidUrl(websiteUrl)) {
      errors.push({ field: 'websiteUrl', message: 'Enter a valid URL (including https://)' });
    } else {
      data.websiteUrl = websiteUrl || null;
    }
  }

  if (input.country !== undefined) {
    data.country = (input.country || '').trim() || null;
  }

  if (input.displayOrder !== undefined) {
    const parsed = parseInt(input.displayOrder, 10);
    if (isNaN(parsed) || parsed < 0) {
      errors.push({ field: 'displayOrder', message: 'Display order must be a non-negative integer' });
    } else {
      data.displayOrder = parsed;
    }
  }

  if (input.status !== undefined) {
    if (!['ACTIVE', 'INACTIVE'].includes(input.status)) {
      errors.push({ field: 'status', message: 'Status must be ACTIVE or INACTIVE' });
    } else {
      data.status = input.status;
    }
  }

  if (input.seoTitle !== undefined) {
    const seoTitle = (input.seoTitle || '').trim();
    if (seoTitle.length > BRAND.SEO_TITLE_MAX_LENGTH) {
      errors.push({ field: 'seoTitle', message: `SEO title must be under ${BRAND.SEO_TITLE_MAX_LENGTH} characters` });
    } else {
      data.seoTitle = seoTitle || null;
    }
  }

  if (input.seoDescription !== undefined) {
    const seoDescription = (input.seoDescription || '').trim();
    if (seoDescription.length > BRAND.SEO_DESCRIPTION_MAX_LENGTH) {
      errors.push({
        field: 'seoDescription',
        message: `SEO description must be under ${BRAND.SEO_DESCRIPTION_MAX_LENGTH} characters`,
      });
    } else {
      data.seoDescription = seoDescription || null;
    }
  }

  if (input.seoKeywords !== undefined) {
    const seoKeywords = (input.seoKeywords || '').trim();
    if (seoKeywords.length > BRAND.SEO_KEYWORDS_MAX_LENGTH) {
      errors.push({ field: 'seoKeywords', message: `SEO keywords must be under ${BRAND.SEO_KEYWORDS_MAX_LENGTH} characters` });
    } else {
      data.seoKeywords = seoKeywords || null;
    }
  }

  if (input.isVerified !== undefined) data.isVerified = parseBoolean(input.isVerified, false);
  if (input.isFeatured !== undefined) data.isFeatured = parseBoolean(input.isFeatured, false);
  if (input.showOnHomepage !== undefined) data.showOnHomepage = parseBoolean(input.showOnHomepage, false);

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateBrandInput };