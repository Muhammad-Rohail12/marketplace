const CATEGORY = require('../constants/category.constants');

const parseBoolean = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
};

const validateCategoryInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) {
      errors.push({ field: 'name', message: 'Category name is required' });
    } else if (name.length < CATEGORY.NAME_MIN_LENGTH || name.length > CATEGORY.NAME_MAX_LENGTH) {
      errors.push({
        field: 'name',
        message: `Name must be between ${CATEGORY.NAME_MIN_LENGTH} and ${CATEGORY.NAME_MAX_LENGTH} characters`,
      });
    } else {
      data.name = name;
    }
  }

  if (input.description !== undefined) {
    const description = (input.description || '').trim();
    if (description.length > CATEGORY.DESCRIPTION_MAX_LENGTH) {
      errors.push({ field: 'description', message: `Description must be under ${CATEGORY.DESCRIPTION_MAX_LENGTH} characters` });
    } else {
      data.description = description || null;
    }
  }

  if (input.parentId !== undefined) {
    if (input.parentId === null || input.parentId === '' || input.parentId === 'null') {
      data.parentId = null;
    } else {
      const parsed = parseInt(input.parentId, 10);
      if (isNaN(parsed)) {
        errors.push({ field: 'parentId', message: 'parentId must be a valid category ID' });
      } else {
        data.parentId = parsed;
      }
    }
  }

  if (input.sortOrder !== undefined) {
    const parsed = parseInt(input.sortOrder, 10);
    if (isNaN(parsed) || parsed < 0) {
      errors.push({ field: 'sortOrder', message: 'sortOrder must be a non-negative integer' });
    } else {
      data.sortOrder = parsed;
    }
  }

  if (input.seoTitle !== undefined) {
    const seoTitle = (input.seoTitle || '').trim();
    if (seoTitle.length > CATEGORY.SEO_TITLE_MAX_LENGTH) {
      errors.push({ field: 'seoTitle', message: `SEO title must be under ${CATEGORY.SEO_TITLE_MAX_LENGTH} characters` });
    } else {
      data.seoTitle = seoTitle || null;
    }
  }

  if (input.seoDescription !== undefined) {
    const seoDescription = (input.seoDescription || '').trim();
    if (seoDescription.length > CATEGORY.SEO_DESCRIPTION_MAX_LENGTH) {
      errors.push({
        field: 'seoDescription',
        message: `SEO description must be under ${CATEGORY.SEO_DESCRIPTION_MAX_LENGTH} characters`,
      });
    } else {
      data.seoDescription = seoDescription || null;
    }
  }

  if (input.seoKeywords !== undefined) {
    const seoKeywords = (input.seoKeywords || '').trim();
    if (seoKeywords.length > CATEGORY.SEO_KEYWORDS_MAX_LENGTH) {
      errors.push({ field: 'seoKeywords', message: `SEO keywords must be under ${CATEGORY.SEO_KEYWORDS_MAX_LENGTH} characters` });
    } else {
      data.seoKeywords = seoKeywords || null;
    }
  }

  if (input.isActive !== undefined) data.isActive = parseBoolean(input.isActive, true);
  if (input.isFeatured !== undefined) data.isFeatured = parseBoolean(input.isFeatured, false);
  if (input.showOnHomepage !== undefined) data.showOnHomepage = parseBoolean(input.showOnHomepage, false);
  if (input.showInNavigation !== undefined) data.showInNavigation = parseBoolean(input.showInNavigation, true);

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateCategoryInput };