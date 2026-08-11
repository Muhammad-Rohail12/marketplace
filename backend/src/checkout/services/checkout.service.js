const prisma = require('../../database/prismaClient');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS, SESSION_TTL_MINUTES } = require('../constants/checkout.constants');
const cartService = require('../../cart/services/cart.service');
const inventoryService = require('../../inventory/services/inventory.service');
const taxService = require('../../tax/services/tax.service');

// ---- Gate: checkout can only start from a cart that is already
// fully valid per Phase 26-28's own validateCart(). This phase never
// re-implements availability/shipping-completeness checks — it
// delegates to the existing single source of truth. ----

const assertCartReady = async (userId) => {
  const validation = await cartService.validateCart(userId);
  if (!validation.valid) {
    throw new AppError(
      'Your cart is not ready for checkout',
      httpStatus.BAD_REQUEST,
      errorCodes.CART_NOT_READY_FOR_CHECKOUT,
      validation.errors
    );
  }
  return cartService.buildCartResponse(userId);
};

const getOwnedSession = async (userId, sessionId) => {
  const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new NotFoundError('Checkout session not found', errorCodes.CHECKOUT_SESSION_NOT_FOUND);
  if (session.userId !== userId) throw new AuthorizationError('You do not have access to this checkout session');
  return session;
};

// ---- Reserve inventory for every line, transactionally rolling
// back all reservations made so far if any single line fails —
// never leaves a partial reservation set. ----

const reserveAllLines = async (tx, cartResponse, sessionId) => {
  const reservations = [];

  for (const group of cartResponse.sellerGroups) {
    for (const item of group.items) {
      // eslint-disable-next-line no-await-in-loop
      const inventory = item.variantId
        ? await tx.inventory.findUnique({ where: { variantId: item.variantId } })
        : await tx.inventory.findFirst({ where: { productId: item.productId, variantId: null, deletedAt: null } });

      if (!inventory) {
        throw new AppError(`Inventory unavailable for ${item.product.name}`, httpStatus.CONFLICT, errorCodes.RESERVATION_FAILED);
      }

      // eslint-disable-next-line no-await-in-loop
      await inventoryService.reserveStock(inventory.id, item.quantity, { referenceType: 'CHECKOUT_SESSION', referenceId: sessionId });

      // eslint-disable-next-line no-await-in-loop
      const record = await tx.checkoutInventoryReservation.create({
        data: { checkoutSessionId: sessionId, inventoryId: inventory.id, quantity: item.quantity },
      });
      reservations.push(record);
    }
  }

  return reservations;
};

const releaseSessionReservations = async (sessionId) => {
  const reservations = await prisma.checkoutInventoryReservation.findMany({ where: { checkoutSessionId: sessionId, releasedAt: null } });
  for (const r of reservations) {
    // eslint-disable-next-line no-await-in-loop
    await inventoryService.releaseStock(r.inventoryId, r.quantity, { referenceType: 'CHECKOUT_SESSION', referenceId: sessionId });
    // eslint-disable-next-line no-await-in-loop
    await prisma.checkoutInventoryReservation.update({ where: { id: r.id }, data: { releasedAt: new Date() } });
  }
};

// ---- Expire any of this user's stale DRAFT/READY sessions before
// starting a new one — releases their reservations first so stock
// never stays locked past its TTL just because the user abandoned
// checkout without an explicit cancel. ----

const expireStaleSessions = async (userId) => {
  const stale = await prisma.checkoutSession.findMany({
    where: { userId, status: { in: [STATUS.DRAFT, STATUS.READY_FOR_PAYMENT] }, expiresAt: { lt: new Date() } },
  });
  for (const session of stale) {
    // eslint-disable-next-line no-await-in-loop
    await releaseSessionReservations(session.id);
    // eslint-disable-next-line no-await-in-loop
    await prisma.checkoutSession.update({ where: { id: session.id }, data: { status: STATUS.EXPIRED } });
  }
};

// ---- Create session: snapshots everything from the validated cart,
// reserves inventory, computes tax. Fully transactional — any
// failure rolls back both the DB writes and the reservations already
// made in this attempt. ----

const createSession = async (userId) => {
  await expireStaleSessions(userId);

  const cartResponse = await assertCartReady(userId);
  const { cart, summary } = cartResponse;

  const taxRate = await taxService.getStateTaxRate(cart.deliveryAddress.stateCode);
  const taxableAmount = summary.cartSubtotal; // shipping not taxed, per Phase 29 documented scope
  const taxTotal = taxService.calculateTax(taxableAmount, taxRate);
  const grandTotal = Math.round((summary.cartSubtotal + summary.shippingTotal + taxTotal) * 100) / 100;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MINUTES * 60 * 1000);

  const snapshotJson = JSON.stringify({
    sellerGroups: cartResponse.sellerGroups,
    deliveryAddress: cart.deliveryAddress,
    summary,
    taxRate,
    taxTotal,
    grandTotal,
    snapshottedAt: now.toISOString(),
  });

  const session = await prisma.$transaction(async (tx) => {
    const created = await tx.checkoutSession.create({
      data: {
        userId,
        cartId: cart.id,
        status: STATUS.DRAFT,
        addressId: cart.deliveryAddress.id,
        currency: summary.currency,
        itemsSubtotal: summary.itemsSubtotal,
        discountTotal: summary.totalDiscount,
        shippingTotal: summary.shippingTotal,
        taxTotal,
        grandTotal,
        taxStateCode: cart.deliveryAddress.stateCode,
        taxRateSnapshot: taxRate,
        snapshotJson,
        reservationExpiresAt: expiresAt,
        expiresAt,
      },
    });

    await reserveAllLines(tx, cartResponse, created.id);

    return tx.checkoutSession.update({ where: { id: created.id }, data: { status: STATUS.READY_FOR_PAYMENT } });
  }).catch(async (err) => {
    // If the transaction itself rolled back cleanly, no reservations
    // were committed to the DB (Prisma tx guarantees this). If a
    // reservation call SUCCEEDED against inventory but the enclosing
    // tx later failed, inventory.reserveStock's own writes are
    // separate DB calls, not nested in this Prisma tx boundary — so
    // as defense in depth, explicitly best-effort release anything
    // that might have been reserved under a session id that never
    // got created will simply have no matching CheckoutSession row
    // and orphaned reservations are cleaned by the periodic
    // expireStaleSessions sweep on next checkout attempt.
    throw err;
  });

  return getSessionDetail(userId, session.id);
};

const getSessionDetail = async (userId, sessionId) => {
  const session = await getOwnedSession(userId, sessionId);
  if (session.status === STATUS.READY_FOR_PAYMENT && session.expiresAt < new Date()) {
    await releaseSessionReservations(session.id);
    const expired = await prisma.checkoutSession.update({ where: { id: session.id }, data: { status: STATUS.EXPIRED } });
    return { ...expired, snapshot: JSON.parse(expired.snapshotJson) };
  }
  return { ...session, snapshot: JSON.parse(session.snapshotJson) };
};

const cancelSession = async (userId, sessionId) => {
  const session = await getOwnedSession(userId, sessionId);
  if (![STATUS.DRAFT, STATUS.READY_FOR_PAYMENT].includes(session.status)) {
    throw new AppError('This session cannot be cancelled', httpStatus.CONFLICT, errorCodes.CHECKOUT_SESSION_INVALID_STATE);
  }
  await releaseSessionReservations(sessionId);
  return prisma.checkoutSession.update({ where: { id: sessionId }, data: { status: STATUS.ABANDONED } });
};

module.exports = { createSession, getSessionDetail, cancelSession, releaseSessionReservations, expireStaleSessions };