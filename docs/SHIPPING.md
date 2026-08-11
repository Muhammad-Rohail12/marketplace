# Shipping & Delivery Methods

## Multi-Seller Shipping (documented per spec's explicit requirement)
This implementation groups shipping **by Store/Seller** — the same grouping already used for cart display since Phase 26. Each seller group gets independently calculated shipping options and an independent selection (`CartShippingSelection`, unique per `cartId + storeId`). Cart-level shipping total is the sum of each group's selected price.

## Zone Resolution
`shipping/utils/zoneResolver.js` — single function, `Address.stateCode` → `AK→ALASKA`, `HI→HAWAII`, `PR→US_TERRITORIES`, else `CONTIGUOUS_US`. `MILITARY` zone exists in the schema but is not yet reachable (Phase 27's US_STATES list doesn't include AA/AE/AP) — documented as a known future extension point.

## Rate Fallback
Seller-specific `ShippingRate` rows take priority; if a seller has none configured for a zone, platform-default rates (`sellerId: null`, admin-managed) are used instead — prevents unshippable carts due to missing seller configuration.

## Free Shipping
Threshold checked at `ShippingRate.freeShippingThreshold` (per-method override) falling back to `SellerShippingSettings.freeShippingThreshold` (seller-wide). No thresholds are hardcoded in application code.