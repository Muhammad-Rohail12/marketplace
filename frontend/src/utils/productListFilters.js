// Phase 22's public listByCategory/listAll endpoints support
// page/limit/sort server-side but NOT brand/price filtering yet (no
// query params exist for those). This applies brand/price filters
// CLIENT-SIDE over the fetched page — an honest, documented interim
// approach. Real server-side faceted filtering (accurate pagination
// against filtered totals, price-range aggregation) is backend work
// planned for Phase 55 (Real Search, Filtering & Sorting).
export function applyClientFilters(products, { brandIds = [], priceMin, priceMax } = {}) {
  return products.filter((p) => {
    if (brandIds.length > 0 && !brandIds.includes(p.brand?.id)) return false;
    const price = p.pricing?.hasPrice ? p.pricing.effectivePrice : null;
    if (priceMin !== undefined && priceMin !== '' && priceMin !== null && (price === null || price < Number(priceMin))) return false;
    if (priceMax !== undefined && priceMax !== '' && priceMax !== null && (price === null || price > Number(priceMax))) return false;
    return true;
  });
}

export function deriveBrandOptions(products) {
  const map = new Map();
  products.forEach((p) => { if (p.brand) map.set(p.brand.id, p.brand); });
  return Array.from(map.values());
}

export function derivePriceBounds(products) {
  const prices = products.map((p) => (p.pricing?.hasPrice ? p.pricing.effectivePrice : null)).filter((v) => v !== null);
  if (!prices.length) return { min: 0, max: 100 };
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) || 100 };
}