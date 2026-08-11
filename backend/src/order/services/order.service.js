const prisma = require('../../database/prismaClient');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS, ALLOWED_TRANSITIONS, BUYER_CANCELLABLE_STATUSES, SELLER_CANCELLABLE_STATUSES } = require('../constants/order.constants');
const { generateOrderNumber } = require('../utils/orderNumber.util');
const checkoutService = require('../../checkout/services/checkout.service');
const inventoryService = require('../../inventory/services/inventory.service');

const assertTransitionAllowed = (from, to) => {
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw new AppError(`Cannot move order from ${from} to ${to}`, httpStatus.CONFLICT, errorCodes.ORDER_INVALID_TRANSITION);
  }
};

const logEvent = (tx, orderId, fromStatus, toStatus, actor, actorId, note = null) =>
  tx.orderStatusEvent.create({ data: { orderId, fromStatus, toStatus, actor, actorId, note } });

// ---- Creation: converts a READY_FOR_PAYMENT CheckoutSession into
// one Order PER SELLER GROUP. Consumes (permanently deducts) the
// reservations made at checkout-session-creation time rather than
// re-checking/re-reserving stock — the whole point of Phase 29's
// reservation step was to lock this exact stock for this exact flow. ----

const createOrdersFromCheckoutSession = async (userId, sessionId) => {
  const session = await checkoutService.getSessionDetail(userId, sessionId);

  if (session.status !== 'READY_FOR_PAYMENT') {
    throw new AppError('This checkout session is not ready to be converted to an order', httpStatus.CONFLICT, errorCodes.CHECKOUT_SESSION_NOT_READY);
  }

  const snapshot = session.snapshot;
  const address = snapshot.deliveryAddress;

  const createdOrders = await prisma.$transaction(async (tx) => {
    const orders = [];

    for (const group of snapshot.sellerGroups) {
      // eslint-disable-next-line no-await-in-loop
      const orderNumber = await generateOrderNumber();
      const groupSubtotal = group.items.reduce((sum, i) => sum + i.lineSubtotal, 0);
      const groupDiscount = group.items.reduce((sum, i) => sum + (i.pricing.discountAmount || 0) * i.quantity, 0);
      const groupTaxShare = snapshot.summary.cartSubtotal > 0
        ? Math.round((groupSubtotal / snapshot.summary.cartSubtotal) * snapshot.taxTotal * 100) / 100
        : 0;

      // eslint-disable-next-line no-await-in-loop
      const order = await tx.order.create({
        data: {
          orderNumber,
          checkoutSessionId: sessionId,
          userId,
          sellerId: group.store.sellerId,
          storeId: group.store.id,
          status: STATUS.PENDING_PAYMENT,
          paymentStatus: 'PENDING',
          currency: snapshot.summary.currency,
          itemsSubtotal: groupSubtotal,
          discountTotal: groupDiscount,
          shippingTotal: group.shipping.selected.price,
          taxTotal: groupTaxShare,
          grandTotal: Math.round((groupSubtotal + group.shipping.selected.price + groupTaxShare) * 100) / 100,
          shippingMethodCode: group.shipping.selected.code,
          shippingMethodName: group.shipping.selected.name,
          estimatedMinDays: group.shipping.selected.minDays,
          estimatedMaxDays: group.shipping.selected.maxDays,
          shipFirstName: address.firstName,
          shipLastName: address.lastName,
          shipCompanyName: address.companyName,
          shipAddressLine1: address.addressLine1,
          shipAddressLine2: address.addressLine2,
          shipCity: address.city,
          shipStateCode: address.stateCode,
          shipPostalCode: address.postalCode,
          shipCountryCode: address.countryCode,
          shipPhone: address.phone,
        },
      });

      for (const item of group.items) {
        // eslint-disable-next-line no-await-in-loop
        const inventory = item.variantId
          ? await tx.inventory.findUnique({ where: { variantId: item.variantId } })
          : await tx.inventory.findFirst({ where: { productId: item.productId, variantId: null, deletedAt: null } });

        // eslint-disable-next-line no-await-in-loop
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            inventoryId: inventory.id,
            productName: item.product.name,
            variantName: item.variant?.name || null,
            sku: null,
            unitPrice: item.pricing.effectivePrice,
            quantity: item.quantity,
            lineSubtotal: item.lineSubtotal,
            imageUrl: item.image?.url || null,
          },
        });
      }

      // eslint-disable-next-line no-await-in-loop
      await logEvent(tx, order.id, null, STATUS.PENDING_PAYMENT, 'SYSTEM', null, 'Order created from checkout');

      orders.push(order);
    }

    await tx.checkoutSession.update({ where: { id: sessionId }, data: { status: 'CONVERTED', convertedAt: new Date() } });

    return orders;
  });

  // Consume (permanently deduct) each reservation now that orders
  // exist — done outside the main tx since inventoryService.consumeStock
  // has its own internal transactional write per Phase 24's design;
  // running it after order commit means a consume failure here never
  // rolls back an already-real order (acceptable: stock ledger can be
  // reconciled, but order/payment integrity must not be undone by an
  // inventory-side hiccup).
  const reservations = await prisma.checkoutInventoryReservation.findMany({ where: { checkoutSessionId: sessionId, releasedAt: null } });
  for (const r of reservations) {
    // eslint-disable-next-line no-await-in-loop
    await inventoryService.consumeStock(r.inventoryId, r.quantity, { referenceType: 'ORDER', referenceId: createdOrders[0]?.id });
    // eslint-disable-next-line no-await-in-loop
    await prisma.checkoutInventoryReservation.update({ where: { id: r.id }, data: { releasedAt: new Date() } });
  }

  return createdOrders.map((o) => o.id);
};

// ---- Ownership resolution ----

const getOwnedOrderAsBuyer = async (userId, orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true, events: { orderBy: { createdAt: 'asc' } } } });
  if (!order) throw new NotFoundError('Order not found', errorCodes.ORDER_NOT_FOUND);
  if (order.userId !== userId) throw new AuthorizationError('You do not have access to this order');
  return order;
};

const getOwnedOrderAsSeller = async (userId, orderId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true, events: { orderBy: { createdAt: 'asc' } } } });
  if (!order) throw new NotFoundError('Order not found', errorCodes.ORDER_NOT_FOUND);
  if (order.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this order');
  return order;
};

// ---- Buyer-facing ----

const listMyOrders = async (userId, { page = 1, limit = 20, status } = {}) => {
  const marketplace = require('../../marketplace');
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: p, limit: l } = resolvePagination({ page, limit });

  const where = { userId, ...(status ? { status } : {}) };
  const [items, totalCount] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, include: { items: true, store: { select: { name: true, slug: true } } } }),
    prisma.order.count({ where }),
  ]);
  return { items, meta: buildPaginationMeta({ page: p, limit: l, totalCount }) };
};

const getMyOrder = (userId, orderId) => getOwnedOrderAsBuyer(userId, orderId);

const buyerCancelOrder = async (userId, orderId, reason) => {
  const order = await getOwnedOrderAsBuyer(userId, orderId);
  if (!BUYER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new AppError('This order can no longer be cancelled by you — please contact the seller', httpStatus.CONFLICT, errorCodes.ORDER_NOT_CANCELLABLE);
  }
  return transitionOrder(order, STATUS.CANCELLED, 'BUYER', userId, reason);
};

// ---- Seller-facing ----

const listSellerOrders = async (userId, { page = 1, limit = 20, status, search } = {}) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);

  const marketplace = require('../../marketplace');
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: p, limit: l } = resolvePagination({ page, limit });

  const where = {
    sellerId: seller.id,
    ...(status ? { status } : {}),
    ...(search ? { orderNumber: { contains: search, mode: 'insensitive' } } : {}),
  };
  const [items, totalCount] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, include: { items: true, user: { select: { firstName: true, lastName: true, email: true } } } }),
    prisma.order.count({ where }),
  ]);
  return { items, meta: buildPaginationMeta({ page: p, limit: l, totalCount }) };
};

const getSellerOrder = (userId, orderId) => getOwnedOrderAsSeller(userId, orderId);

const sellerUpdateStatus = async (userId, orderId, toStatus, note) => {
  const order = await getOwnedOrderAsSeller(userId, orderId);

  if (toStatus === STATUS.CANCELLED && !SELLER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new AppError('This order can no longer be cancelled', httpStatus.CONFLICT, errorCodes.ORDER_NOT_CANCELLABLE);
  }

  return transitionOrder(order, toStatus, 'SELLER', userId, note);
};

// ---- Admin-facing ----

const listAllOrders = async ({ page = 1, limit = 20, status, search } = {}) => {
  const marketplace = require('../../marketplace');
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: p, limit: l } = resolvePagination({ page, limit });

  const where = { ...(status ? { status } : {}), ...(search ? { orderNumber: { contains: search, mode: 'insensitive' } } : {}) };
  const [items, totalCount] = await Promise.all([
    prisma.order.findMany({
      where, orderBy: { createdAt: 'desc' }, skip, take,
      include: { items: true, user: { select: { firstName: true, lastName: true, email: true } }, store: { select: { name: true } } },
    }),
    prisma.order.count({ where }),
  ]);
  return { items, meta: buildPaginationMeta({ page: p, limit: l, totalCount }) };
};

const getAdminOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true, events: { orderBy: { createdAt: 'asc' } },
      user: { select: { firstName: true, lastName: true, email: true } },
      store: { select: { name: true } },
    },
  });
  if (!order) throw new NotFoundError('Order not found', errorCodes.ORDER_NOT_FOUND);
  return order;
};

const adminUpdateStatus = async (adminId, orderId, toStatus, note) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError('Order not found', errorCodes.ORDER_NOT_FOUND);
  return transitionOrder(order, toStatus, 'ADMIN', adminId, note);
};

// ---- Shared transition executor (used by buyer/seller/admin paths) ----

const transitionOrder = async (order, toStatus, actor, actorId, note) => {
  assertTransitionAllowed(order.status, toStatus);

  return prisma.$transaction(async (tx) => {
    const data = { status: toStatus };
    if (toStatus === STATUS.CANCELLED) { data.cancelledAt = new Date(); data.cancelReason = note || null; }
    if (toStatus === STATUS.DELIVERED) data.deliveredAt = new Date();
    if (toStatus === STATUS.PAID) data.paymentStatus = 'PAID';
    if (toStatus === STATUS.REFUNDED) data.paymentStatus = 'REFUNDED';

    const updated = await tx.order.update({ where: { id: order.id }, data });
    await logEvent(tx, order.id, order.status, toStatus, actor, actorId, note);

    // Cancelling/refunding restores stock — the only place in this
    // phase that calls restoreStock (Phase 24), mirroring consumeStock's
    // single call site in createOrdersFromCheckoutSession above.
    if (toStatus === STATUS.CANCELLED || toStatus === STATUS.REFUNDED) {
      const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        // eslint-disable-next-line no-await-in-loop
        await require('../../inventory/services/inventory.service').restoreStock(item.inventoryId, item.quantity, { referenceType: 'ORDER', referenceId: order.id });
      }
    }

    return updated;
  });
};

module.exports = {
  createOrdersFromCheckoutSession,
  listMyOrders, getMyOrder, buyerCancelOrder,
  listSellerOrders, getSellerOrder, sellerUpdateStatus,
  listAllOrders, getAdminOrder, adminUpdateStatus,
};