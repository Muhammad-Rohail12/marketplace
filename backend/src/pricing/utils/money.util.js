// All authoritative arithmetic happens in integer cents/paisa, never
// raw floating-point major-unit values (e.g. never `5000 * 0.2`
// directly) — this eliminates the classic 0.1 + 0.2 floating-point
// class of bugs for money, per spec's explicit requirement.

const toCents = (value) => {
  if (value === null || value === undefined) return 0;
  // Number(x) correctly unwraps Prisma's Decimal objects via valueOf().
  return Math.round(Number(value) * 100);
};

const fromCents = (cents) => Math.round(cents) / 100;

const roundToCents = (value) => fromCents(toCents(value));

module.exports = { toCents, fromCents, roundToCents };