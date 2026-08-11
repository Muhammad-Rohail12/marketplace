const formatPrice = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

module.exports = { formatPrice };