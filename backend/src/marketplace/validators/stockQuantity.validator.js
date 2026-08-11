const isValidStockQuantity = (quantity) => {
  const num = Number(quantity);
  return Number.isInteger(num) && num >= 0;
};

module.exports = { isValidStockQuantity };