# Shopping Cart System

## Architecture
User → Cart (status ACTIVE, one at a time) → CartItem[] → Product / VariantCombination
↓ ↓
pricingEngine (Ph.25) Inventory (Ph.24)
Cart is never the source of truth for price, discount, or stock — `buildCartResponse()` re-resolves both fresh on every `GET /api/cart` call.

## Cart Count Convention
`count = TOTAL UNITS` across all lines (not unique line count) — e.g. 2× Product A + 3× Product B = badge shows `5`. Defined once in `cart.constants.js: COUNT_MODE` and consumed identically by `getCartItemCount` (backend) and `CartProvider` (frontend).

## Duplicate Line Prevention
`@@unique([cartId, productId, variantId])` at the DB level for variant lines; `addItem()`'s explicit `findUnique`-then-merge logic handles the "add same item twice" case gracefully (quantity sums) rather than surfacing a raw constraint error.

## Multi-Seller Grouping
`buildCartResponse()` groups resolved items by `product.store.id` into `sellerGroups[]` — this is the same shape the future multi-vendor checkout will split into separate fulfillment groups.

## Warnings vs Errors
- **Warning** (shown, item stays in cart): out of stock, insufficient quantity, price unavailable, product/variant no longer available
- **Error** (returned by `POST /api/cart/validate`, blocks future checkout): same underlying conditions, surfaced as blocking issues for the future checkout flow to consult

## Currency
Defaults to `USD` (USA Master Requirement) via `pricing.constants.js: DEFAULT_CURRENCY`. Cart does not mix currencies or perform conversion.

## Security
See Security Notes in the Phase 26 implementation notes — no `cartId` route param exists anywhere, closing the primary IDOR vector by construction.

## Future Checkout Integration
`POST /api/cart/validate` already returns the exact `{valid, errors, warnings}` shape a future checkout flow needs to gate order creation. `reserveStock()` (Phase 24) is intentionally NOT called anywhere in this phase — checkout will be the first caller.

## Testing
See Testing Steps in the Phase 26 implementation notes.