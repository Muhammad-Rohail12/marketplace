const STATUS = { IN_STOCK: 'IN_STOCK', LOW_STOCK: 'LOW_STOCK', OUT_OF_STOCK: 'OUT_OF_STOCK', BACKORDER: 'BACKORDER', DISCONTINUED: 'DISCONTINUED' };

const MOVEMENT_TYPE = {
  INITIAL_STOCK: 'INITIAL_STOCK',
  RESTOCK: 'RESTOCK',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
  RESERVATION: 'RESERVATION',
  RELEASE: 'RELEASE',
  SALE: 'SALE',
  RETURN: 'RETURN',
  DAMAGE: 'DAMAGE',
  LOSS: 'LOSS',
  CORRECTION: 'CORRECTION',
  TRANSFER_PLACEHOLDER: 'TRANSFER_PLACEHOLDER',
};

// Movement types a seller may trigger directly via the adjustment/
// restock UI in this phase. SALE/RESERVATION/RELEASE are reserved
// for the future Cart/Order system to call programmatically — a
// seller cannot manually record a "SALE" movement, that would be
// fabricating sales history.
const SELLER_TRIGGERABLE_TYPES = [
  MOVEMENT_TYPE.INITIAL_STOCK,
  MOVEMENT_TYPE.RESTOCK,
  MOVEMENT_TYPE.MANUAL_ADJUSTMENT,
  MOVEMENT_TYPE.DAMAGE,
  MOVEMENT_TYPE.LOSS,
  MOVEMENT_TYPE.CORRECTION,
];

const LIMITS = {
  MAX_INITIAL_STOCK: 1_000_000,
  MAX_ADJUSTMENT_MAGNITUDE: 1_000_000,
  MAX_QUANTITY: 10_000_000, // sanity ceiling — guards against integer-overflow-style input
  MAX_THRESHOLD: 100_000,
  REASON_MAX_LENGTH: 500,
};

const ALLOWED_SORT_FIELDS = ['quantity', 'createdAt', 'updatedAt', 'status'];

module.exports = { STATUS, MOVEMENT_TYPE, SELLER_TRIGGERABLE_TYPES, LIMITS, ALLOWED_SORT_FIELDS };