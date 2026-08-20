// Static mock data for UI-only phases (32-50) to render against
// before real API wiring happens in Phase 54+. Shape mirrors the
// real backend's public product response (Phase 22/23/25) so a
// service file can return either with no UI change.
export const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: 1000 + i,
  name: `Sample Product ${i + 1}`,
  slug: `sample-product-${i + 1}`,
  shortDescription: 'A premium example product used for UI development.',
  brand: { id: 1, name: 'Acme', slug: 'acme' },
  media: [{ id: 1, url: '/placeholder-image.png', altText: 'Sample product', isPrimary: true }],
  pricing: { hasPrice: true, currency: 'USD', basePrice: 49.99, effectivePrice: i % 3 === 0 ? 39.99 : 49.99, hasDiscount: i % 3 === 0, discountPercentage: i % 3 === 0 ? 20 : 0 },
  rating: { average: 4 + (i % 2) * 0.5, count: 100 + i * 17 },
}));

export const getMockProducts = () => Promise.resolve({ data: { products: MOCK_PRODUCTS } });
export const getMockProductBySlug = (slug) => {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  return Promise.resolve({ data: { product } });
};