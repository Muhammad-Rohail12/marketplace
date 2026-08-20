// MOCK DATA — clearly isolated from real product/pricing/inventory
// data throughout the rest of the app. This is Phase 42's explicitly
// authorized frontend-only review dataset (no Review backend model
// exists yet). Shape matches the documented future contract:
// GET /api/products/:productId/reviews so Phase 55 can swap this
// file for a real service call with zero UI changes.
//
// IMPORTANT PRODUCTION NOTE: this mock dataset must be removed/
// disconnected before any real deployment — it is not real customer
// feedback and must never be presented as such in production.

const REVIEWER_NAMES = ['Sarah M.', 'James T.', 'Priya K.', 'David L.', 'Amanda R.', 'Michael B.', 'Jessica W.', 'Robert C.', 'Emily H.', 'Chris P.'];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Deliberately mixed distribution (not all 5-star) — per spec's
// explicit "do not make every review 5 stars" requirement.
export const MOCK_REVIEWS = [
  { id: 1, rating: 5, title: 'Excellent quality, highly recommend', body: 'This exceeded my expectations. Build quality feels premium and it arrived faster than expected. Would definitely buy again.', reviewerName: REVIEWER_NAMES[0], createdAt: daysAgo(3), isVerifiedPurchase: true, variant: 'Black', helpfulCount: 124, images: ['/mock/review-1a.jpg', '/mock/review-1b.jpg'], status: 'PUBLISHED' },
  { id: 2, rating: 4, title: 'Great value for the price', body: 'Does what it says. Only minor gripe is the packaging could be sturdier, but the product itself works great.', reviewerName: REVIEWER_NAMES[1], createdAt: daysAgo(9), isVerifiedPurchase: true, variant: null, helpfulCount: 87, images: [], status: 'PUBLISHED' },
  { id: 3, rating: 3, title: 'It\'s okay, not amazing', body: 'Works as described but nothing special. I expected a bit more given the reviews. Might return it.', reviewerName: REVIEWER_NAMES[2], createdAt: daysAgo(15), isVerifiedPurchase: false, variant: 'Blue / Large', helpfulCount: 41, images: [], status: 'PUBLISHED' },
  { id: 4, rating: 5, title: 'Perfect, exactly what I needed', body: 'Fast shipping, well packaged, and the quality is fantastic. Customer service was also very responsive when I had a question.', reviewerName: REVIEWER_NAMES[3], createdAt: daysAgo(21), isVerifiedPurchase: true, variant: null, helpfulCount: 203, images: ['/mock/review-4a.jpg'], status: 'PUBLISHED' },
  { id: 5, rating: 2, title: 'Disappointed with durability', body: 'Started showing wear after just two weeks of normal use. Not what I expected for the price point.', reviewerName: REVIEWER_NAMES[4], createdAt: daysAgo(30), isVerifiedPurchase: true, variant: 'Red', helpfulCount: 56, images: [], status: 'PUBLISHED' },
  { id: 6, rating: 5, title: 'Beautiful design, works flawlessly', body: 'I was skeptical at first but this has become one of my favorite purchases this year.', reviewerName: REVIEWER_NAMES[5], createdAt: daysAgo(45), isVerifiedPurchase: true, variant: null, helpfulCount: 178, images: [], status: 'PUBLISHED' },
  { id: 7, rating: 4, title: 'Good but shipping took a while', body: 'Product is great once it arrived, but delivery was slower than the estimate.', reviewerName: REVIEWER_NAMES[6], createdAt: daysAgo(52), isVerifiedPurchase: false, variant: 'Black / Medium', helpfulCount: 22, images: [], status: 'PUBLISHED' },
  { id: 8, rating: 1, title: 'Not as described', body: 'The color was noticeably different from the photos. Requested a return.', reviewerName: REVIEWER_NAMES[7], createdAt: daysAgo(60), isVerifiedPurchase: true, variant: 'Blue', helpfulCount: 34, images: [], status: 'PUBLISHED' },
  { id: 9, rating: 5, title: 'Five stars, no complaints', body: 'Simple, reliable, and does exactly what I need. Already recommended it to a friend.', reviewerName: REVIEWER_NAMES[8], createdAt: daysAgo(70), isVerifiedPurchase: true, variant: null, helpfulCount: 91, images: ['/mock/review-9a.jpg', '/mock/review-9b.jpg', '/mock/review-9c.jpg'], status: 'PUBLISHED' },
  { id: 10, rating: 4, title: 'Solid purchase overall', body: 'A few minor quirks but nothing dealbreaking. Happy with the purchase.', reviewerName: REVIEWER_NAMES[9], createdAt: daysAgo(80), isVerifiedPurchase: false, variant: null, helpfulCount: 15, images: [], status: 'PUBLISHED' },
];

// Same mock set for any productId in this dev/demo context — a real
// backend would scope by productId server-side.
export function getMockReviewsForProduct() {
  return MOCK_REVIEWS.filter((r) => r.status === 'PUBLISHED');
}