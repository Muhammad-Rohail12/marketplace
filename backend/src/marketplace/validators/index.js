module.exports = {
  ...require('./sku.validator'),
  ...require('./price.validator'),
  ...require('./discount.validator'),
  ...require('./stockQuantity.validator'),
  ...require('./imageMetadata.validator'),
};