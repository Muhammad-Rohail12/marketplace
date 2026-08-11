# Product Pricing, Discounts & Deals

## Architecture
Product / VariantCombination → ProductPrice (basePrice, compareAtPrice, costPrice)
↓
Discount[] (PERCENTAGE | FIXED_AMOUNT, optionally grouped by Deal)
↓
pricingEngine.calculateEffectivePrice() ← single source of truth
↓
{ effectivePrice, discountAmount, discountPercentage, hasDiscount }
## Money Representation
Postgres `Decimal(12,2)` at rest. All authoritative arithmetic happens in integer cents (`pricing/utils/money.util.js`) — never raw floating-point major-unit multiplication.

## Currency
Fixed server-side list (`PKR, USD, EUR, SAR, AED`) — no arbitrary client-supplied currency codes. No conversion between currencies in this phase.

## Discount Priority / No Stacking
Only one enabled, date-active discount is ever applied per price record. Creating/enabling an overlapping second discount is rejected (`OVERLAPPING_DISCOUNT`). Tie-break (if ever reached): most recently created wins.

## Deals
A `Deal` is a named promotional period. Individual `Discount` rows reference `dealId` and copy the deal's `startAt`/`endAt` at creation time (static, not a live join). Disabling a deal cascades to disable all its discounts; enabling does not force-reactivate individually-disabled ones.

## Price History
Append-only `PriceHistory` table. Every base-price/compare-at/cost change and every discount create/update/disable writes a row. Admin adjustments always require a stated reason.

## Security
`costPrice` is never returned by any public or seller-list endpoint — only the admin list. See Security Notes in the Phase 25 implementation notes for the full model.

## API
See the API Contract table in the Phase 25 implementation notes.

## Future Cart/Checkout/Order Integration
`pricingEngine.calculateEffectivePrice()` is the one function a future Cart/Checkout system should call to get an authoritative price at add-to-cart time. Order price snapshots (immutable copy of the effective price at purchase time) are a natural next step once Orders exist — not implemented here, but this engine's clean single-return-value shape makes that snapshot trivial to build later.

## Testing
See Testing Steps in the Phase 25 implementation notes.