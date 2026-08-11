const STATUS = { DRAFT: 'DRAFT', READY_FOR_PAYMENT: 'READY_FOR_PAYMENT', EXPIRED: 'EXPIRED', ABANDONED: 'ABANDONED', CONVERTED: 'CONVERTED' };

// A checkout session holds inventory reservations, so its lifetime
// must be short and bounded — long enough for a customer to enter
// payment details, short enough that abandoned sessions don't lock
// stock indefinitely.
const SESSION_TTL_MINUTES = 20;

module.exports = { STATUS, SESSION_TTL_MINUTES };