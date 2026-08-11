const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS, ALLOWED_TRANSITIONS, SELLER_EDITABLE_STATUSES, PRODUCT_TYPE } = require('../constants/product.constants');

const logAudit = (productId, actorId, action, metadata = null) =>
  prisma.productAuditEvent.create({ data: { productId, actorId, action, metadata: metadata ? JSON.stringify(metadata) : null } });

const assertTransitionAllowed = (from, to) => {
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw new AppError(`Cannot move product from ${from} to ${to}`, httpStatus.CONFLICT, errorCodes.INVALID_STATE_TRANSITION);
  }
};

const getSellerByUserId = async (userId) => {
  const seller = await prisma.seller.findUnique({ where: { userId }, include: { store: true } });
  if (!seller || seller.deletedAt) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);
  if (!seller.store) throw new NotFoundError('Store not found — complete your store profile first', errorCodes.STORE_NOT_FOUND);
  return seller;
};

const generateUniqueSlug = async (name) => {
  const base = marketplace.helpers.slug.generateSlug(name) || 'product';
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

const assertCategoryValid = async (categoryId) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.deletedAt || !category.isActive) {
    throw new AppError('Selected category is not available', httpStatus.BAD_REQUEST, errorCodes.INVALID_CATEGORY);
  }
  return category;
};

const assertBrandValid = async (brandId) => {
  if (!brandId) return;
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand || brand.deletedAt || brand.status !== 'ACTIVE') {
    throw new AppError('Selected brand is not available', httpStatus.BAD_REQUEST, errorCodes.INVALID_BRAND);
  }
};

const assertUniqueSkuForSeller = async (sellerId, sku, excludeProductId = null) => {
  if (!sku) return;
  const existing = await prisma.product.findFirst({
    where: { sellerId, sku, ...(excludeProductId ? { id: { not: excludeProductId } } : {}) },
  });
  if (existing) throw new AppError('You already have a product with this SKU', httpStatus.CONFLICT, errorCodes.DUPLICATE_SKU);
};

const assertUniqueBarcodeForSeller = async (sellerId, barcode, excludeProductId = null) => {
  if (!barcode) return;
  const existing = await prisma.product.findFirst({
    where: { sellerId, barcode, ...(excludeProductId ? { id: { not: excludeProductId } } : {}) },
  });
  if (existing) throw new AppError('You already have a product with this barcode', httpStatus.CONFLICT, errorCodes.DUPLICATE_BARCODE);
};

// ---- Seller ----

const createProduct = async (userId, data) => {
  const seller = await getSellerByUserId(userId);
  await assertCategoryValid(data.categoryId);
  if (data.brandId) await assertBrandValid(data.brandId);
  await assertUniqueSkuForSeller(seller.id, data.sku);
  await assertUniqueBarcodeForSeller(seller.id, data.barcode);

  const slug = await generateUniqueSlug(data.name);

  const product = await prisma.product.create({
    data: { ...data, sellerId: seller.id, storeId: seller.store.id, slug, status: STATUS.DRAFT },
  });
  await logAudit(product.id, userId, 'CREATED');
  return product;
};

const getOwnedProduct = async (userId, productId) => {
  const seller = await getSellerByUserId(userId);
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      brand: true,
      attributeValues: { include: { attribute: true, attributeValue: true } },
      specifications: { orderBy: { displayOrder: 'asc' } },
      variants: { include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } } },
    },
  });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this product');
  return product;
};

const listMyProducts = async (userId, { page, limit, status, search, sort } = {}) => {
  const seller = await getSellerByUserId(userId);
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const ALLOWED = require('../constants/product.constants').ALLOWED_SORT_FIELDS;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ALLOWED, 'createdAt');

  const where = {
    sellerId: seller.id,
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take, include: { category: true, brand: true } }),
    prisma.product.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const updateProduct = async (userId, productId, data) => {
  const seller = await getSellerByUserId(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this product');

  if (!SELLER_EDITABLE_STATUSES.includes(product.status)) {
    throw new AppError('This product can no longer be edited', httpStatus.CONFLICT, errorCodes.PRODUCT_NOT_EDITABLE);
  }

  if (data.categoryId) await assertCategoryValid(data.categoryId);
  if (data.brandId) await assertBrandValid(data.brandId);
  if (data.sku !== undefined) await assertUniqueSkuForSeller(seller.id, data.sku, productId);
  if (data.barcode !== undefined) await assertUniqueBarcodeForSeller(seller.id, data.barcode, productId);

  const updateResult = await prisma.product.updateMany({
    where: { id: productId, version: product.version },
    data: { ...data, version: { increment: 1 } },
  });

  if (updateResult.count === 0) {
    throw new AppError('This product was updated elsewhere. Please refresh and try again.', httpStatus.CONFLICT, errorCodes.CONCURRENT_MODIFICATION);
  }

  await logAudit(productId, userId, 'UPDATED');
  return getOwnedProduct(userId, productId);
};

const upsertAttributeValues = async (userId, productId, attributeValues) => {
  const product = await getOwnedProduct(userId, productId);

  await prisma.$transaction(
    attributeValues.map((av) =>
      prisma.productAttributeValue.upsert({
        where: { productId_attributeId: { productId, attributeId: av.attributeId } },
        update: { attributeValueId: av.attributeValueId, value: av.value },
        create: { productId, attributeId: av.attributeId, attributeValueId: av.attributeValueId, value: av.value },
      })
    )
  );

  // Validate required category attributes are now satisfied.
  const requiredAttrs = await prisma.categoryAttribute.findMany({
    where: { categoryId: product.categoryId, isRequired: true },
    include: { attribute: true },
  });
  const currentValues = await prisma.productAttributeValue.findMany({ where: { productId } });
  const satisfiedIds = new Set(currentValues.filter((v) => v.value || v.attributeValueId).map((v) => v.attributeId));
  const missing = requiredAttrs.filter((ra) => !satisfiedIds.has(ra.attributeId));

  await logAudit(productId, userId, 'ATTRIBUTES_UPDATED');

  return { product: await getOwnedProduct(userId, productId), missingRequiredAttributes: missing.map((m) => m.attribute.name) };
};

const upsertSpecifications = async (userId, productId, specifications) => {
  await getOwnedProduct(userId, productId);

  await prisma.$transaction([
    prisma.productSpecificationValue.deleteMany({ where: { productId } }),
    prisma.productSpecificationValue.createMany({ data: specifications.map((s) => ({ ...s, productId })) }),
  ]);

  await logAudit(productId, userId, 'SPECIFICATIONS_UPDATED');
  return getOwnedProduct(userId, productId);
};

// ---- Variant management (scoped to a seller-owned product) ----

const findCombinationBySameOptions = async (productId, optionIds, excludeId = null) => {
  if (!optionIds.length) return null;
  const candidates = await prisma.variantCombination.findMany({
    where: { productId, ...(excludeId ? { id: { not: excludeId } } : {}) },
    include: { options: true },
  });
  const sortedTarget = [...optionIds].sort().join(',');
  return candidates.find((c) => c.options.map((o) => o.variantOptionId).sort().join(',') === sortedTarget);
};

const createVariant = async (userId, productId, data, optionIds) => {
  const product = await getOwnedProduct(userId, productId);
  const seller = await getSellerByUserId(userId);

  if (product.productType !== PRODUCT_TYPE.VARIABLE) {
    throw new AppError('Variants can only be added to VARIABLE products', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  if (!optionIds.length) {
    throw new AppError('At least one variant option is required', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  const duplicate = await findCombinationBySameOptions(productId, optionIds);
  if (duplicate) {
    throw new AppError('A variant with these exact options already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_VARIANT_COMBINATION);
  }

  if (data.sku) {
    const skuClash = await prisma.variantCombination.findFirst({
      where: { sku: data.sku, product: { sellerId: seller.id } },
    });
    if (skuClash) throw new AppError('You already have a variant with this SKU', httpStatus.CONFLICT, errorCodes.DUPLICATE_SKU);
  }

  const combination = await prisma.variantCombination.create({
    data: { ...data, productId, options: { create: optionIds.map((variantOptionId) => ({ variantOptionId })) } },
    include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } },
  });

  await logAudit(productId, userId, 'VARIANT_CREATED', { variantId: combination.id });
  return combination;
};

const updateVariant = async (userId, productId, variantId, data, optionIds) => {
  await getOwnedProduct(userId, productId);
  const existing = await prisma.variantCombination.findUnique({ where: { id: variantId } });
  if (!existing || existing.productId !== productId) throw new NotFoundError('Variant not found', errorCodes.VARIANT_COMBINATION_NOT_FOUND);

  if (optionIds && optionIds.length) {
    const duplicate = await findCombinationBySameOptions(productId, optionIds, variantId);
    if (duplicate) throw new AppError('A variant with these exact options already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_VARIANT_COMBINATION);
    await prisma.variantCombinationOption.deleteMany({ where: { combinationId: variantId } });
    await prisma.variantCombinationOption.createMany({ data: optionIds.map((variantOptionId) => ({ combinationId: variantId, variantOptionId })) });
  }

  const updated = await prisma.variantCombination.update({
    where: { id: variantId },
    data,
    include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } },
  });
  await logAudit(productId, userId, 'VARIANT_UPDATED', { variantId });
  return updated;
};

const deleteVariant = async (userId, productId, variantId) => {
  await getOwnedProduct(userId, productId);
  const existing = await prisma.variantCombination.findUnique({ where: { id: variantId } });
  if (!existing || existing.productId !== productId) throw new NotFoundError('Variant not found', errorCodes.VARIANT_COMBINATION_NOT_FOUND);
  await prisma.variantCombination.delete({ where: { id: variantId } });
  await logAudit(productId, userId, 'VARIANT_DELETED', { variantId });
};

// ---- State transitions (seller) ----

const submitProduct = async (userId, productId) => {
  const seller = await getSellerByUserId(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this product');
  assertTransitionAllowed(product.status, STATUS.PENDING_REVIEW);

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { status: STATUS.PENDING_REVIEW, submittedAt: new Date() },
  });
  await logAudit(productId, userId, 'SUBMITTED');
  return updated;
};

const archiveProduct = async (userId, productId) => {
  const seller = await getSellerByUserId(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this product');
  assertTransitionAllowed(product.status, STATUS.ARCHIVED);

  const updated = await prisma.product.update({ where: { id: productId }, data: { status: STATUS.ARCHIVED } });
  await logAudit(productId, userId, 'ARCHIVED');
  return updated;
};

const duplicateProduct = async (userId, productId) => {
  const original = await getOwnedProduct(userId, productId);
  const seller = await getSellerByUserId(userId);
  const slug = await generateUniqueSlug(`${original.name} copy`);

  const copy = await prisma.product.create({
    data: {
      sellerId: seller.id,
      storeId: seller.store.id,
      categoryId: original.categoryId,
      brandId: original.brandId,
      name: `${original.name} (Copy)`,
      slug,
      shortDescription: original.shortDescription,
      description: original.description,
      productType: original.productType,
      condition: original.condition,
      modelNumber: original.modelNumber,
      manufacturer: original.manufacturer,
      countryOfOrigin: original.countryOfOrigin,
      warrantyInformation: original.warrantyInformation,
      weight: original.weight,
      weightUnit: original.weightUnit,
      status: STATUS.DRAFT,
    },
  });

  await prisma.productAttributeValue.createMany({
    data: original.attributeValues.map((av) => ({
      productId: copy.id,
      attributeId: av.attributeId,
      attributeValueId: av.attributeValueId,
      value: av.value,
    })),
  });
  await prisma.productSpecificationValue.createMany({
    data: original.specifications.map((s) => ({ productId: copy.id, label: s.label, value: s.value, group: s.group, displayOrder: s.displayOrder })),
  });

  await logAudit(copy.id, userId, 'DUPLICATED_FROM', { originalId: productId });
  return copy;
};

// ---- Admin ----

const listAllProducts = async ({ page, limit, status, search, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const ALLOWED = require('../constants/product.constants').ALLOWED_SORT_FIELDS;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ALLOWED, 'createdAt');

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        category: true,
        brand: true,
        seller: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        store: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getProductForAdmin = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      seller: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      store: true,
      attributeValues: { include: { attribute: true, attributeValue: true } },
      specifications: true,
      variants: { include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } } },
      auditEvents: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  return product;
};

const approveProduct = async (adminId, id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  assertTransitionAllowed(product.status, STATUS.ACTIVE);

  const updated = await prisma.product.update({
    where: { id },
    data: { status: STATUS.ACTIVE, publishedAt: new Date(), reviewedAt: new Date(), reviewedById: adminId },
  });
  await logAudit(id, adminId, 'APPROVED');
  return updated;
};

const rejectProduct = async (adminId, id, rejectionReason) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  assertTransitionAllowed(product.status, STATUS.REJECTED);

  const updated = await prisma.product.update({
    where: { id },
    data: { status: STATUS.REJECTED, rejectionReason, reviewedAt: new Date(), reviewedById: adminId },
  });
  await logAudit(id, adminId, 'REJECTED', { rejectionReason });
  return updated;
};

const deactivateProduct = async (adminId, id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  assertTransitionAllowed(product.status, STATUS.INACTIVE);

  const updated = await prisma.product.update({ where: { id }, data: { status: STATUS.INACTIVE } });
  await logAudit(id, adminId, 'ADMIN_DEACTIVATED');
  return updated;
};

const adminArchiveProduct = async (adminId, id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  assertTransitionAllowed(product.status, STATUS.ARCHIVED);

  const updated = await prisma.product.update({ where: { id }, data: { status: STATUS.ARCHIVED } });
  await logAudit(id, adminId, 'ADMIN_ARCHIVED');
  return updated;
};

// ---- Public ----

const PUBLIC_SELECT = {
  id: true, name: true, slug: true, shortDescription: true, description: true,
  productType: true, condition: true, manufacturer: true, countryOfOrigin: true, warrantyInformation: true,
  weight: true, weightUnit: true, length: true, width: true, height: true, dimensionUnit: true,
  seoTitle: true, seoDescription: true, createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true, isVerified: true } },
  store: { select: { id: true, name: true, slug: true, logo: true } },
  attributeValues: { select: { attribute: { select: { name: true, type: true } }, attributeValue: { select: { label: true, colorHex: true } }, value: true } },
  specifications: { select: { label: true, value: true, group: true, displayOrder: true } },
  variants: {
    select: {
      id: true, name: true, sku: true, price: true, status: true,
      options: { select: { variantOption: { select: { attribute: { select: { name: true } }, attributeValue: { select: { label: true, colorHex: true } } } } } },
    },
  },
};

const getPublicProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({ where: { slug }, select: { ...PUBLIC_SELECT, status: true, visibility: true, deletedAt: true } });
  if (!product || product.deletedAt || product.status !== STATUS.ACTIVE || product.visibility !== 'PUBLIC') {
    throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  }
  const { status, visibility, deletedAt, ...safe } = product;
  return safe;
};

const listPublicByCategory = async (categoryId, { page, limit } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const where = { categoryId: Number(categoryId), status: STATUS.ACTIVE, visibility: 'PUBLIC', deletedAt: null };

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, select: PUBLIC_SELECT }),
    prisma.product.count({ where }),
  ]);
  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const listPublicByBrand = async (brandId, { page, limit } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const where = { brandId: Number(brandId), status: STATUS.ACTIVE, visibility: 'PUBLIC', deletedAt: null };

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, select: PUBLIC_SELECT }),
    prisma.product.count({ where }),
  ]);
  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getRelatedProducts = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return [];
  return prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: productId }, status: STATUS.ACTIVE, visibility: 'PUBLIC', deletedAt: null },
    take: 4,
    select: PUBLIC_SELECT,
  });
};

module.exports = {
  createProduct, getOwnedProduct, listMyProducts, updateProduct,
  upsertAttributeValues, upsertSpecifications,
  createVariant, updateVariant, deleteVariant,
  submitProduct, archiveProduct, duplicateProduct,
  listAllProducts, getProductForAdmin, approveProduct, rejectProduct, deactivateProduct, adminArchiveProduct,
  getPublicProductBySlug, listPublicByCategory, listPublicByBrand, getRelatedProducts,
};