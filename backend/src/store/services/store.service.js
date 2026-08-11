const fs = require('fs/promises');
const path = require('path');
const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const marketplace = require('../../marketplace');
const { UPLOAD_DIR, PUBLIC_PATH_PREFIX } = require('../middlewares/uploadStoreMedia.middleware');
const logger = require('../../utils/logger');

// ---- Resolution helpers (identity always comes from req.user.id) ----

const getSellerByUserId = async (userId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller || seller.deletedAt) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);
  return seller;
};

const getMySellerProfile = async (userId) => {
  const seller = await getSellerByUserId(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  return { ...seller, user };
};

// No store yet is a real possibility right after approval if the
// transaction somehow didn't create one (legacy data) — lazily
// create a DRAFT store in that edge case rather than hard-failing.
const getMyStore = async (userId) => {
  const seller = await getSellerByUserId(userId);
  let store = await prisma.store.findUnique({ where: { sellerId: seller.id }, include: { policies: true } });

  if (!store) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const slug = await generateUniqueSlug(`${user.firstName} ${user.lastName} Store`);
    store = await prisma.store.create({
      data: { sellerId: seller.id, name: `${user.firstName}'s Store`, slug, status: 'DRAFT' },
      include: { policies: true },
    });
  }

  return store;
};

const generateUniqueSlug = async (name, excludeId = null) => {
  const base = marketplace.helpers.slug.generateSlug(name) || 'store';
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.store.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

const updateMyStore = async (userId, data) => {
  const seller = await getSellerByUserId(userId);
  const store = await prisma.store.findUnique({ where: { sellerId: seller.id } });
  if (!store) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const updateResult = await prisma.store.updateMany({
    where: { id: store.id, version: store.version },
    data: { ...data, version: { increment: 1 } },
  });

  if (updateResult.count === 0) {
    throw new AppError(
      'Your store was updated elsewhere. Please refresh and try again.',
      httpStatus.CONFLICT,
      errorCodes.CONCURRENT_MODIFICATION
    );
  }

  await prisma.storeAuditEvent.create({ data: { storeId: store.id, actorId: userId, action: 'UPDATED' } });

  const updated = await prisma.store.findUnique({ where: { id: store.id }, include: { policies: true } });

  // A store only becomes publicly ACTIVE once the seller has filled
  // in the minimum professional profile — never auto-activates on a
  // partial save, and never silently deactivates on further edits.
  if (updated.status === 'DRAFT' && updated.name && updated.description && updated.address) {
    return prisma.store.update({ where: { id: updated.id }, data: { status: 'ACTIVE' }, include: { policies: true } });
  }

  return updated;
};

const upsertPolicies = async (userId, policies) => {
  const seller = await getSellerByUserId(userId);
  const store = await prisma.store.findUnique({ where: { sellerId: seller.id } });
  if (!store) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  await prisma.$transaction(
    policies.map((p) =>
      prisma.storePolicy.upsert({
        where: { storeId_type: { storeId: store.id, type: p.type } },
        update: { content: p.content },
        create: { storeId: store.id, type: p.type, content: p.content },
      })
    )
  );

  await prisma.storeAuditEvent.create({ data: { storeId: store.id, actorId: userId, action: 'POLICIES_UPDATED' } });

  return prisma.store.findUnique({ where: { id: store.id }, include: { policies: true } });
};

const deleteFileIfExists = async (relativePath) => {
  if (!relativePath) return;
  const filename = path.basename(relativePath);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch (err) {
    if (err.code !== 'ENOENT') logger.warn('Failed to delete store media file:', err.message);
  }
};

const updateStoreMedia = async (userId, files) => {
  const seller = await getSellerByUserId(userId);
  const store = await prisma.store.findUnique({ where: { sellerId: seller.id } });
  if (!store) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const data = {};
  if (files?.logo?.[0]) data.logo = `${PUBLIC_PATH_PREFIX}/${files.logo[0].filename}`;
  if (files?.banner?.[0]) data.banner = `${PUBLIC_PATH_PREFIX}/${files.banner[0].filename}`;
  if (files?.icon?.[0]) data.icon = `${PUBLIC_PATH_PREFIX}/${files.icon[0].filename}`;

  if (Object.keys(data).length === 0) {
    throw new AppError('No image files provided', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  if (data.logo && store.logo) await deleteFileIfExists(store.logo);
  if (data.banner && store.banner) await deleteFileIfExists(store.banner);
  if (data.icon && store.icon) await deleteFileIfExists(store.icon);

  const updated = await prisma.store.update({ where: { id: store.id }, data, include: { policies: true } });
  await prisma.storeAuditEvent.create({ data: { storeId: store.id, actorId: userId, action: 'MEDIA_UPDATED' } });

  return updated;
};

// ---- Public ----

// Returns ONLY public-safe fields — never sellerId, internal audit
// data, version numbers, or admin notes. Suspended/inactive/deleted
// stores are treated identically to non-existent for anonymous users.
const getPublicStoreBySlug = async (slug) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { policies: true },
  });

  if (!store || store.deletedAt || store.status !== 'ACTIVE') {
    throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);
  }

  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    shortDescription: store.shortDescription,
    description: store.description,
    logo: store.logo,
    banner: store.banner,
    icon: store.icon,
    country: store.country,
    stateProvince: store.stateProvince,
    city: store.city,
    isFeatured: store.isFeatured,
    seoTitle: store.seoTitle,
    seoDescription: store.seoDescription,
    createdAt: store.createdAt,
    policies: store.policies.map((p) => ({ type: p.type, content: p.content })),
    contact: store.showContactInformation ? { email: store.email, phone: store.phone, website: store.website } : null,
  };
};

// ---- Admin ----

const listStores = async ({ page, limit, search, status, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ['name', 'createdAt'], 'createdAt');

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.store.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { seller: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
    }),
    prisma.store.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getStoreById = async (id) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      seller: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      policies: true,
      auditEvents: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!store || store.deletedAt) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);
  return store;
};

const suspendStore = async (adminId, id) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store || store.deletedAt) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const updated = await prisma.store.update({ where: { id }, data: { status: 'SUSPENDED' } });
  await prisma.storeAuditEvent.create({ data: { storeId: id, actorId: adminId, action: 'ADMIN_SUSPENDED' } });
  return updated;
};

const activateStore = async (adminId, id) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store || store.deletedAt) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const updated = await prisma.store.update({ where: { id }, data: { status: 'ACTIVE' } });
  await prisma.storeAuditEvent.create({ data: { storeId: id, actorId: adminId, action: 'ADMIN_ACTIVATED' } });
  return updated;
};

const featureStore = async (adminId, id, isFeatured) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store || store.deletedAt) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const updated = await prisma.store.update({ where: { id }, data: { isFeatured } });
  await prisma.storeAuditEvent.create({
    data: { storeId: id, actorId: adminId, action: isFeatured ? 'ADMIN_FEATURED' : 'ADMIN_UNFEATURED' },
  });
  return updated;
};

module.exports = {
  getMySellerProfile,
  getMyStore,
  updateMyStore,
  upsertPolicies,
  updateStoreMedia,
  getPublicStoreBySlug,
  listStores,
  getStoreById,
  suspendStore,
  activateStore,
  featureStore,
};