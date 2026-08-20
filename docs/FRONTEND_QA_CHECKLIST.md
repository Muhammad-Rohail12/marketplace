# Frontend QA Checklist — Phase 50

## Cross-Browser / Cross-Viewport
- [ ] Chrome, Firefox, Safari, Edge — homepage, product page, cart, checkout
- [ ] Viewports: 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920px
- [ ] Dark mode toggled at every viewport above

## Core Flows (must pass before deploy)
- [ ] Register → verify email → login → logout (Phase 8-11)
- [ ] Browse category → filter → sort → product page → variant select → add to cart (Phase 38-40)
- [ ] Cart → address → shipping → checkout → place order (Phase 43-44)
- [ ] Seller: create product → set price → set inventory → see it live (Phase 47)
- [ ] Admin: approve a seller application, approve a product (Phase 48)

## Error States
- [ ] `/does-not-exist` → custom 404 (Phase 50)
- [ ] Product/category with bad slug → 404, not a crash
- [ ] Backend stopped → pages show real error/empty states, not blank screens
- [ ] Force a component error → route-level `error.js` recovers with "Try Again"

## Known, Documented Gaps (NOT bugs — intentionally deferred, see phase notes)
- Reviews (Phase 42) are mock data — no real Review backend yet (Phase 55+)
- Wishlist / Saved-for-Later / Recently Viewed are local-storage only, not account-synced
- Promo codes (Phase 43) and payment method selector (Phase 44) are UI-only, no backend
- `InventoryTable`/`PricingTable`/seller-orders list still use raw tables, not yet on `ResponsiveDataTable` (Phase 49 follow-up)
- No delivery-estimate or discount-countdown real data (Phase 41/36 documented backend gaps)
- No server-side brand/price faceted filtering — client-side over one page only (Phase 38/39 documented gap)

## Accessibility Spot-Check
- [ ] Tab through header, mega menu, mobile drawer — focus visible at every step
- [ ] Screen reader announces cart count changes, toast messages
- [ ] All images have alt text or are marked decorative
- [ ] Color contrast checked on primary/danger/warning tokens in both themes

## Performance Spot-Check
- [ ] Homepage Lighthouse run (mobile + desktop)
- [ ] Product page image loading (lazy-loaded below the fold)
- [ ] No layout shift on skeleton → real content swap