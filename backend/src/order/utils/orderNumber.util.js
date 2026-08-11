const prisma = require('../../database/prismaClient');

// Generates human-readable, date-scoped, gap-tolerant sequential
// order numbers: ORD-20260810-00001. Uses an atomic upsert+increment
// on a dedicated sequence row (not a raw COUNT(*) on Order, which
// would race under concurrent checkout completions) so two orders
// created in the same millisecond never collide.
const generateOrderNumber = async () => {
  const now = new Date();
  const dateKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  const seq = await prisma.$transaction(async (tx) => {
    const existing = await tx.orderNumberSequence.findUnique({ where: { dateKey } });
    if (existing) {
      return tx.orderNumberSequence.update({ where: { dateKey }, data: { lastValue: { increment: 1 } } });
    }
    return tx.orderNumberSequence.create({ data: { dateKey, lastValue: 1 } });
  });

  return `ORD-${dateKey}-${String(seq.lastValue).padStart(5, '0')}`;
};

module.exports = { generateOrderNumber };