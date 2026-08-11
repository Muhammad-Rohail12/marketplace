const CURRENCY_LOCALE_MAP = { USD: 'en-US', PKR: 'en-PK', EUR: 'de-DE', SAR: 'ar-SA', AED: 'ar-AE' };

export function formatMoney(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  const locale = CURRENCY_LOCALE_MAP[currency] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}