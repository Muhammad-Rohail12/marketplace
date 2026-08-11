# Product Management System

## Architecture
User (SELLER) → Seller → Store → Product → Category
→ Brand (optional)
→ ProductAttributeValue → Attribute/AttributeValue (PIM)
→ ProductSpecificationValue
→ VariantCombination (PIM, now FK'd to Product) → VariantCombinationOption → VariantOption
No category-specific product tables — all category-specific behavior comes from PIM's `CategoryAttribute` assignments (Phase 19).

## Lifecycle
DRAFT → PENDING_REVIEW → ACTIVE → INACTIVE / ARCHIVED / OUT_OF_STOCK
↘ REJECTED (seller must duplicate to revise)
## SKU/Barcode Uniqueness
Per-seller, not global — `@@unique([sellerId, sku])` on `Product`; variant SKUs checked at the service layer against the same seller's other variants. Two different sellers may share an SKU (e.g. a shared manufacturer part number).

## API
See the API Contract table in the Phase 22 implementation notes. Seller routes: `/api/seller/products/*` (ownership via JWT, no ID-based trust). Admin/public routes: `/api/products/*`.

## Frontend
Seller product creation is a **tabbed form** (Basic Info / Category & Brand / Attributes / Variants / Specifications / SEO / Review) rather than a literal 9-page wizard — same functional coverage, consistent with the tabbed pattern used in Phase 19/21. `ProductCard` is the single reusable card component intended for Homepage/Category/Search/Brand/Store pages in future phases.

## Security
See Security Notes in the Phase 22 implementation notes — IDOR protection, admin-only transitions, public data allow-listing, per-seller SKU uniqueness, optimistic concurrency, audit trail.

## Testing
See Testing Steps in the Phase 22 implementation notes.