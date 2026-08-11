# Seller Store & Business Profile

## Architecture
User (role=SELLER) → Seller (1:1) → Store (1:1) → StorePolicy (1:many)
`Seller` and `Store` are created automatically inside Phase 20's `approveApplication` transaction — no separate "create store" step exists for sellers.

## Store Lifecycle
DRAFT → (name + description + address all filled) → ACTIVE → SUSPENDED (admin only)
Sellers can never set `status` directly — only admin endpoints (`/suspend`, `/activate`) or the auto-activation rule change it.

## Store Slug
Generated once at creation from the business name (collision-safe: `name`, `name-2`, `name-3`...) — stable thereafter, never regenerated on name edits.

## API
See the API Contract table in the Phase 21 implementation notes. Seller-owned endpoints under `/api/seller/*` take no ID param (ownership via JWT only). Admin/public endpoints under `/api/stores/*`.

## Public vs Private Data
`getPublicStoreBySlug` returns an explicit allow-list of fields — see Security Notes in the Phase 21 implementation notes.

## Media
Local disk (`uploads/store-media/`) behind `store/middlewares/uploadStoreMedia.middleware.js` and `store/services/store.service.js`'s upload handling — swapping to Cloudinary/S3 later only touches these two files.

## Concurrency
`Store.version` field + conditional `updateMany` — see Security Notes.

## Testing
See Testing Steps in the Phase 21 implementation notes.