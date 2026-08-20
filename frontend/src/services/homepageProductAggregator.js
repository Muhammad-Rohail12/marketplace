import { productService } from '@/services/productService';
import { listCategories } from '@/services/categoryService';
import { pricingService } from '@/services/pricingService';
import { HOMEPAGE_CATEGORY_SLUGS, PRODUCT_RAIL_FETCH_LIMIT } from '@/constants/homepageSections';

async function fetchProductsAcrossHomepageCategories(limitPerCategory = PRODUCT_RAIL_FETCH_LIMIT) {
  const { data } = await listCategories({ limit: 200 });
  const bySlug = new Map(data.categories.map((c) => [c.slug, c]));

  const targets = HOMEPAGE_CATEGORY_SLUGS
    .map(({ slug }) => bySlug.get(slug))
    .filter(Boolean);

  if (targets.length === 0) return [];

  const results = await Promise.all(
    targets.map((cat) => productService.listByCategory(cat.id, { limit: limitPerCategory }).catch(() => ({ data: { products: [] } })))
  );

  const merged = results.flatMap((r) => r.data.products || []);
  const seen = new Set();
  return merged.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
}

export async function getTrendingProducts(limit = 10) {
  const all = await fetchProductsAcrossHomepageCategories();
  return [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
}

export async function getRecommendedProducts(limit = 10) {
  const all = await fetchProductsAcrossHomepageCategories();
  return [...all].sort(() => Math.random() - 0.5).slice(0, limit);
}

// Now also attaches a real dealEndAt per product where available —
// only used by deal-specific UI (Phase 36); other callers of this
// aggregator (Trending/Recommendations) don't need it and skip the
// extra lookups.
export async function getDealsProducts(limit = 10, { withEndDates = false } = {}) {
  const all = await fetchProductsAcrossHomepageCategories();
  const deals = all.filter((p) => p.pricing?.hasDiscount).slice(0, limit);

  if (!withEndDates) return deals;

  const withDates = await Promise.all(
    deals.map(async (p) => {
      try {
        const res = await pricingService.getProductPricing(p.id);
        return { ...p, dealEndAt: null, pricing: { ...p.pricing, ...res.data.pricing } };
      } catch {
        return p;
      }
    })
  );
  return withDates;
}