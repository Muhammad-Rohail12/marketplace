// No generic "all active products" public endpoint exists yet
// (planned for Phase 55). Until then, homepage product rails are
// composed from real category/brand data using the category slugs
// below. Missing slugs are skipped gracefully (empty section), never
// faked with mock data on a page real customers will see.
export const HOMEPAGE_CATEGORY_SLUGS = [
  { slug: 'beauty', title: 'Beauty' },
  { slug: 'sports', title: 'Sports' },
  { slug: 'kitchen', title: 'Kitchen' },
  { slug: 'home-decor', title: 'Home Decoration' },
  { slug: 'watches', title: 'Watches' },
  { slug: 'technology', title: 'Technology' },
  { slug: 'skin-care', title: 'Skin & Care' },
];

// "Trending" and "Recommendations" have no real ranking/personalization
// signal yet (no view-count or purchase-history aggregation exists in
// the backend). Both are approximated here from real, currently-ACTIVE
// products pulled from the homepage categories above — genuinely real
// products, just not yet ranked by an actual trending/personalization
// algorithm. Documented clearly so this is understood as a placeholder
// ranking, not placeholder data.
export const PRODUCT_RAIL_FETCH_LIMIT = 8;