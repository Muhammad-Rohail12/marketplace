const Currency = require('../enums/currency.enum');

const isSupportedCurrency = (code) => Object.values(Currency).includes(code);

module.exports = { isSupportedCurrency };