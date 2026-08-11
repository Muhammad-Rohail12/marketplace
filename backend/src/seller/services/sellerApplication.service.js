const prisma = require('../../database/prismaClient');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const ROLES = require('../../constants/roles');
const { STATUS, ALLOWED_TRANSITIONS } = require('../constants/sellerApplication.constants');
const { sendMail } = require('../../auth/services/email.service');
const emails = require('../templates/sellerApplicationEmails.template');
const logger = require('../../utils/logger');
const marketplace = require('../../marketplace');

const ACTIVE_STATUSES = [STATUS.DRAFT, STATUS.SUBMITTED, STATUS.UNDER_REVIEW];

const logAudit = (applicationId, actorId, action, metadata = null) =>
  prisma.sellerApplicationAuditEvent.create({
    data: { applicationId, actorId, action, metadata: metadata ? JSON.stringify(metadata) : null },
  });

const assertTransitionAllowed = (from, to) => {
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw new AppError(
      `Cannot move application from ${from} to ${to}`,
      httpStatus.CONFLICT,
      errorCodes.INVALID_STATE_TRANSITION
    );
  }
};

// ---- Applicant-facing ----

const getOrCreateDraft = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user.role === ROLES.SELLER) {
    throw new AppError('You already have an approved seller account', httpStatus.CONFLICT, errorCodes.ALREADY_A_SELLER);
  }

  const activeApp = await prisma.sellerApplication.findFirst({
    where: { userId, status: { in: ACTIVE_STATUSES }, deletedAt: null },
  });
  if (activeApp) return activeApp;

  const draft = await prisma.sellerApplication.create({
    data: {
      userId,
      businessName: '',
      businessType: '',
      contactName: `${user.firstName} ${user.lastName}`,
      contactEmail: user.email,
      contactPhone: user.phone || '',
      country: '',
      stateProvince: '',
      city: '',
      address: '',
      postalCode: '',
      status: STATUS.DRAFT,
    },
  });
  await logAudit(draft.id, userId, 'CREATED_DRAFT');
  return draft;
};

const getMyApplication = async (userId) => {
  const application = await prisma.sellerApplication.findFirst({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  if (!application) throw new NotFoundError('No application found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
  return application;
};

const assertOwnership = (application, userId) => {
  if (application.userId !== userId) {
    throw new AuthorizationError('You do not have access to this application');
  }
};

const updateDraft = async (userId, applicationId, data) => {
  const application = await prisma.sellerApplication.findUnique({ where: { id: applicationId } });
  if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
  assertOwnership(application, userId);

  if (application.status !== STATUS.DRAFT) {
    throw new AppError('Only draft applications can be edited', httpStatus.CONFLICT, errorCodes.INVALID_STATE_TRANSITION);
  }

  return prisma.sellerApplication.update({ where: { id: applicationId }, data });
};

const submitApplication = async (userId, applicationId, data) => {
  return prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
    assertOwnership(application, userId);
    assertTransitionAllowed(application.status, STATUS.SUBMITTED);

    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user.emailVerified) {
      throw new AppError('Please verify your email before applying to sell', httpStatus.FORBIDDEN, errorCodes.EMAIL_NOT_VERIFIED);
    }

    const updated = await tx.sellerApplication.update({
      where: { id: applicationId, version: application.version },
      data: { ...data, status: STATUS.SUBMITTED, submittedAt: new Date(), version: { increment: 1 } },
    });

    await tx.sellerApplicationAuditEvent.create({
      data: { applicationId, actorId: userId, action: 'SUBMITTED' },
    });

    return updated;
  }).catch((err) => {
    if (err.code === 'P2025') {
      throw new AppError('This application was modified elsewhere. Please refresh and try again.', httpStatus.CONFLICT, errorCodes.CONCURRENT_MODIFICATION);
    }
    throw err;
  }).then(async (updated) => {
    try {
      await sendMail({ to: updated.contactEmail, ...emails.submittedEmail(updated) });
    } catch (err) {
      logger.error('Failed to send application-submitted email:', err);
    }
    return updated;
  });
};

const cancelApplication = async (userId, applicationId) => {
  const application = await prisma.sellerApplication.findUnique({ where: { id: applicationId } });
  if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
  assertOwnership(application, userId);
  assertTransitionAllowed(application.status, STATUS.CANCELLED);

  const updated = await prisma.sellerApplication.update({
    where: { id: applicationId },
    data: { status: STATUS.CANCELLED, cancelledAt: new Date() },
  });
  await logAudit(applicationId, userId, 'CANCELLED');
  return updated;
};

// ---- Admin-facing ----

const listApplications = async ({ page, limit, status, search, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ['businessName', 'submittedAt', 'createdAt'], 'createdAt');

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { businessName: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.sellerApplication.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { applicant: { select: { id: true, firstName: true, lastName: true, email: true } } },
    }),
    prisma.sellerApplication.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getApplicationById = async (id) => {
  const application = await prisma.sellerApplication.findUnique({
    where: { id },
    include: {
      applicant: { select: { id: true, firstName: true, lastName: true, email: true, createdAt: true } },
      reviewedBy: { select: { id: true, firstName: true, lastName: true } },
      auditEvents: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
  return application;
};

const startReview = async (adminId, applicationId) => {
  const application = await prisma.sellerApplication.findUnique({ where: { id: applicationId } });
  if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
  assertTransitionAllowed(application.status, STATUS.UNDER_REVIEW);

  const updated = await prisma.sellerApplication.update({
    where: { id: applicationId },
    data: { status: STATUS.UNDER_REVIEW, reviewedById: adminId, reviewedAt: new Date() },
  });
  await logAudit(applicationId, adminId, 'REVIEW_STARTED');
  return updated;
};

// Generates a unique store slug from the business name, handling
// collisions the same way Categories/Brands do (name, name-2, name-3...).
const generateUniqueStoreSlug = async (tx, name) => {
  const base = marketplace.helpers.slug.generateSlug(name);
  let slug = base || 'store';
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await tx.store.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

// Approval is fully atomic: application status + Seller role +
// Seller entity + Store (DRAFT) + audit event all happen in one
// transaction. Optimistic concurrency (`version`) prevents two
// admins approving simultaneously — the second transaction's
// conditional update matches zero rows and rolls back cleanly.
// Idempotent for Seller/Store: if either already exists for this
// user (e.g. a prior partial run), they are reused, never duplicated.
const approveApplication = async (adminId, applicationId, { adminNotes } = {}) => {
  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
    assertTransitionAllowed(application.status, STATUS.APPROVED);

    const updateResult = await tx.sellerApplication.updateMany({
      where: { id: applicationId, version: application.version },
      data: {
        status: STATUS.APPROVED,
        approvedAt: new Date(),
        reviewedById: adminId,
        reviewedAt: new Date(),
        adminNotes: adminNotes ?? application.adminNotes,
        version: { increment: 1 },
      },
    });

    if (updateResult.count === 0) {
      throw new AppError(
        'This application was just modified by another admin. Please refresh and try again.',
        httpStatus.CONFLICT,
        errorCodes.CONCURRENT_MODIFICATION
      );
    }

    await tx.user.update({ where: { id: application.userId }, data: { role: ROLES.SELLER } });

    let seller = await tx.seller.findUnique({ where: { userId: application.userId } });
    if (!seller) {
      seller = await tx.seller.create({
        data: { userId: application.userId, status: 'ACTIVE', approvedAt: new Date() },
      });
    }

    let store = await tx.store.findUnique({ where: { sellerId: seller.id } });
    if (!store) {
      const slug = await generateUniqueStoreSlug(tx, application.businessName);
      store = await tx.store.create({
        data: {
          sellerId: seller.id,
          name: application.businessName,
          slug,
          shortDescription: application.businessDescription
            ? application.businessDescription.slice(0, 200)
            : null,
          description: application.businessDescription || null,
          email: application.contactEmail,
          phone: application.contactPhone,
          country: application.country,
          stateProvince: application.stateProvince,
          city: application.city,
          address: application.address,
          postalCode: application.postalCode,
          status: 'DRAFT',
        },
      });
      await tx.storeAuditEvent.create({
        data: { storeId: store.id, actorId: adminId, action: 'CREATED_ON_APPROVAL' },
      });
    }

    await tx.sellerApplicationAuditEvent.create({
      data: { applicationId, actorId: adminId, action: 'APPROVED' },
    });

    return tx.sellerApplication.findUnique({ where: { id: applicationId } });
  });

  try {
    await sendMail({ to: result.contactEmail, ...emails.approvedEmail(result) });
  } catch (err) {
    logger.error('Failed to send approval email:', err);
  }

  return result;
};

const rejectApplication = async (adminId, applicationId, { rejectionReason }) => {
  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
    assertTransitionAllowed(application.status, STATUS.REJECTED);

    const updateResult = await tx.sellerApplication.updateMany({
      where: { id: applicationId, version: application.version },
      data: {
        status: STATUS.REJECTED,
        rejectedAt: new Date(),
        reviewedById: adminId,
        reviewedAt: new Date(),
        rejectionReason,
        version: { increment: 1 },
      },
    });

    if (updateResult.count === 0) {
      throw new AppError(
        'This application was just modified by another admin. Please refresh and try again.',
        httpStatus.CONFLICT,
        errorCodes.CONCURRENT_MODIFICATION
      );
    }

    await tx.sellerApplicationAuditEvent.create({
      data: { applicationId, actorId: adminId, action: 'REJECTED', metadata: JSON.stringify({ rejectionReason }) },
    });

    return tx.sellerApplication.findUnique({ where: { id: applicationId } });
  });

  try {
    await sendMail({ to: result.contactEmail, ...emails.rejectedEmail(result) });
  } catch (err) {
    logger.error('Failed to send rejection email:', err);
  }

  return result;
};

const suspendSeller = async (adminId, applicationId, { adminNotes } = {}) => {
  return prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) throw new NotFoundError('Application not found', errorCodes.SELLER_APPLICATION_NOT_FOUND);
    assertTransitionAllowed(application.status, STATUS.SUSPENDED);

    const updated = await tx.sellerApplication.update({
      where: { id: applicationId },
      data: { status: STATUS.SUSPENDED, suspendedAt: new Date(), adminNotes: adminNotes ?? application.adminNotes },
    });

    await tx.user.update({ where: { id: application.userId }, data: { role: ROLES.BUYER } });

    const seller = await tx.seller.findUnique({ where: { userId: application.userId } });
    if (seller) {
      await tx.seller.update({ where: { id: seller.id }, data: { status: 'SUSPENDED', suspendedAt: new Date() } });
      const store = await tx.store.findUnique({ where: { sellerId: seller.id } });
      if (store && store.status !== 'SUSPENDED') {
        await tx.store.update({ where: { id: store.id }, data: { status: 'SUSPENDED' } });
        await tx.storeAuditEvent.create({
          data: { storeId: store.id, actorId: adminId, action: 'SUSPENDED_VIA_APPLICATION' },
        });
      }
    }

    await tx.sellerApplicationAuditEvent.create({
      data: { applicationId, actorId: adminId, action: 'SUSPENDED' },
    });

    return updated;
  });
};

module.exports = {
  getOrCreateDraft,
  getMyApplication,
  updateDraft,
  submitApplication,
  cancelApplication,
  listApplications,
  getApplicationById,
  startReview,
  approveApplication,
  rejectApplication,
  suspendSeller,
};