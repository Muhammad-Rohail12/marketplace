const prisma = require('../../database/prismaClient');
const storage = require('../storage');
const { validateImageBuffer } = require('../validators/media.validator');
const MEDIA = require('../constants/media.constants');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const logger = require('../../utils/logger');

// ---- Ownership resolution (identical pattern to Phase 22's product.service.js) ----

const getOwnedProductOrThrow = async (userId, productId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller || seller.deletedAt) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this product');

  return product;
};

const generateFallbackAltText = (productName, position, variantLabel) => {
  const base = variantLabel ? `${productName} — ${variantLabel}` : productName;
  return `${base}, image ${position}`;
};

// ---- Upload ----

const uploadMedia = async (userId, productId, files, { variantId } = {}) => {
  const product = await getOwnedProductOrThrow(userId, productId);

  if (variantId) {
    const variant = await prisma.variantCombination.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant does not belong to this product', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT_ASSOCIATION);
    }
  }

  const existingCount = await prisma.productMedia.count({ where: { productId, status: { not: 'DELETED' } } });
  if (existingCount + files.length > MEDIA.MAX_IMAGES_PER_PRODUCT) {
    throw new AppError(
      `Cannot exceed ${MEDIA.MAX_IMAGES_PER_PRODUCT} images per product`,
      httpStatus.BAD_REQUEST,
      errorCodes.MAX_IMAGES_EXCEEDED
    );
  }

  const maxSortOrder = await prisma.productMedia.aggregate({
    where: { productId, status: { not: 'DELETED' } },
    _max: { sortOrder: true },
  });
  let nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  const hasPrimaryAlready = await prisma.productMedia.findFirst({ where: { productId, isPrimary: true, status: { not: 'DELETED' } } });

  const created = [];
  for (const file of files) {
    // Validate content BEFORE any storage write — a rejected file
    // never reaches disk. Processed sequentially (not Promise.all)
    // so sortOrder assignment stays deterministic and a mid-batch
    // failure doesn't leave partially-numbered gaps.
    // eslint-disable-next-line no-await-in-loop
    const { extension, width, height, mimeType } = await validateImageBuffer(file.buffer);
    // eslint-disable-next-line no-await-in-loop
    const { storageKey, fileName } = await storage.upload(file.buffer, { productId, extension });

    const isPrimary = !hasPrimaryAlready && created.length === 0;

    // eslint-disable-next-line no-await-in-loop
    const record = await prisma.productMedia.create({
      data: {
        productId,
        variantId: variantId || null,
        type: 'IMAGE',
        url: storage.getUrl(storageKey),
        storageKey,
        originalFileName: file.originalname.slice(0, 255),
        fileName,
        mimeType,
        fileSize: file.buffer.length,
        width,
        height,
        altText: generateFallbackAltText(product.name, nextSortOrder + 1, null),
        sortOrder: nextSortOrder,
        isPrimary,
        status: 'ACTIVE',
      },
    });

    created.push(record);
    nextSortOrder += 1;
  }

  return created;
};

// ---- List / get ----

const listMediaForOwner = async (userId, productId) => {
  await getOwnedProductOrThrow(userId, productId);
  return prisma.productMedia.findMany({
    where: { productId, status: { not: 'DELETED' } },
    orderBy: { sortOrder: 'asc' },
  });
};

const getMediaOrThrow = async (productId, mediaId) => {
  const media = await prisma.productMedia.findUnique({ where: { id: mediaId } });
  if (!media || media.productId !== productId || media.status === 'DELETED') {
    throw new NotFoundError('Media not found', errorCodes.MEDIA_NOT_FOUND);
  }
  return media;
};

// ---- Metadata update ----

const updateMediaMetadata = async (userId, productId, mediaId, data) => {
  await getOwnedProductOrThrow(userId, productId);
  await getMediaOrThrow(productId, mediaId);

  if (data.variantId !== undefined && data.variantId !== null) {
    const variant = await prisma.variantCombination.findUnique({ where: { id: data.variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant does not belong to this product', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT_ASSOCIATION);
    }
  }

  return prisma.productMedia.update({ where: { id: mediaId }, data });
};

// ---- Set primary (transactional: unset old, set new) ----

const setPrimary = async (userId, productId, mediaId) => {
  await getOwnedProductOrThrow(userId, productId);
  await getMediaOrThrow(productId, mediaId);

  await prisma.$transaction([
    prisma.productMedia.updateMany({ where: { productId, isPrimary: true }, data: { isPrimary: false } }),
    prisma.productMedia.update({ where: { id: mediaId }, data: { isPrimary: true } }),
  ]);

  return prisma.productMedia.findMany({ where: { productId, status: { not: 'DELETED' } }, orderBy: { sortOrder: 'asc' } });
};

// ---- Reorder ----

const reorderMedia = async (userId, productId, orderedIds) => {
  await getOwnedProductOrThrow(userId, productId);

  const existing = await prisma.productMedia.findMany({ where: { productId, status: { not: 'DELETED' } } });
  const existingIds = new Set(existing.map((m) => m.id));
  const allBelong = orderedIds.every((id) => existingIds.has(id));
  if (!allBelong || orderedIds.length !== existing.length) {
    throw new AppError('Reorder list must include exactly this product\'s current media IDs', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  await prisma.$transaction(orderedIds.map((id, index) => prisma.productMedia.update({ where: { id }, data: { sortOrder: index } })));

  return prisma.productMedia.findMany({ where: { productId, status: { not: 'DELETED' } }, orderBy: { sortOrder: 'asc' } });
};

// ---- Delete (with primary-reassignment) ----

const deleteMedia = async (userId, productId, mediaId) => {
  await getOwnedProductOrThrow(userId, productId);
  const media = await getMediaOrThrow(productId, mediaId);

  // Physical deletion happens first — if it throws, we haven't
  // touched the DB yet, so no inconsistent state is created. If the
  // DB update below fails after a successful physical delete, the
  // record becomes an orphaned reference to a missing file, which is
  // the safer failure mode (broken image, not a phantom 500) versus
  // deleting the DB row first and leaving an unreachable file on disk.
  try {
    await storage.delete(media.storageKey);
  } catch (err) {
    logger.error('Failed to delete physical media file:', err);
  }

  await prisma.$transaction(async (tx) => {
    await tx.productMedia.update({ where: { id: mediaId }, data: { status: 'DELETED', deletedAt: new Date() } });

    if (media.isPrimary) {
      const nextPrimary = await tx.productMedia.findFirst({
        where: { productId, status: { not: 'DELETED' }, id: { not: mediaId } },
        orderBy: { sortOrder: 'asc' },
      });
      if (nextPrimary) {
        await tx.productMedia.update({ where: { id: nextPrimary.id }, data: { isPrimary: true } });
      }
    }
  });
};

// ---- Replace ----

const replaceMedia = async (userId, productId, mediaId, file) => {
  await getOwnedProductOrThrow(userId, productId);
  const media = await getMediaOrThrow(productId, mediaId);

  const { extension, width, height, mimeType } = await validateImageBuffer(file.buffer);
  const { storageKey, fileName } = await storage.upload(file.buffer, { productId, extension });

  // Old file deleted only after the new one is safely written and
  // the DB record updated — avoids a window where the record points
  // to a file that no longer exists.
  const updated = await prisma.productMedia.update({
    where: { id: mediaId },
    data: {
      url: storage.getUrl(storageKey),
      storageKey,
      originalFileName: file.originalname.slice(0, 255),
      fileName,
      mimeType,
      fileSize: file.buffer.length,
      width,
      height,
    },
  });

  try {
    await storage.delete(media.storageKey);
  } catch (err) {
    logger.error('Failed to delete old media file after replacement:', err);
  }

  return updated;
};

// ---- Public ----

const getPublicMediaForProduct = async (productId) => {
  return prisma.productMedia.findMany({
    where: { productId, status: 'ACTIVE', type: 'IMAGE' },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, url: true, altText: true, title: true, width: true, height: true, isPrimary: true, sortOrder: true, variantId: true },
  });
};

const getPrimaryMediaForProducts = async (productIds) => {
  // Batched lookup for ProductCard grids — avoids N+1 by fetching all
  // primary images for a page of products in one query.
  const media = await prisma.productMedia.findMany({
    where: { productId: { in: productIds }, isPrimary: true, status: 'ACTIVE' },
    select: { productId: true, url: true, altText: true, width: true, height: true },
  });
  const map = new Map(media.map((m) => [m.productId, m]));
  return map;
};

// ---- Admin ----

const adminDeleteMedia = async (adminId, productId, mediaId) => {
  const media = await getMediaOrThrow(productId, mediaId);
  try {
    await storage.delete(media.storageKey);
  } catch (err) {
    logger.error('Admin media delete: failed to remove physical file:', err);
  }
  await prisma.productMedia.update({ where: { id: mediaId }, data: { status: 'DELETED', deletedAt: new Date() } });
};

module.exports = {
  uploadMedia, listMediaForOwner, updateMediaMetadata, setPrimary, reorderMedia,
  deleteMedia, replaceMedia, getPublicMediaForProduct, getPrimaryMediaForProducts, adminDeleteMedia,
};