const InventoryStatus = require('../enums/inventoryStatus.enum');
const { INVENTORY } = require('../constants/marketplace.constants');

// Placeholder logic — real stock-movement tracking arrives with the
// Inventory Management phase. This just classifies a raw quantity.
const resolveInventoryStatus = (quantity) => {
  if (quantity <= 0) return InventoryStatus.OUT_OF_STOCK;
  if (quantity <= INVENTORY.LOW_STOCK_THRESHOLD) return InventoryStatus.LOW_STOCK;
  return InventoryStatus.IN_STOCK;
};

module.exports = { resolveInventoryStatus };