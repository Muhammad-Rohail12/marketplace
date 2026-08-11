# Marketplace Domain Foundation

## Purpose
Shared, reusable infrastructure that every future marketplace feature (Products, Categories, Sellers, Orders, etc.) builds on top of — established before any of those features exist, so they arrive consistent from day one rather than each reinventing pagination, sorting, media handling, etc.

## Folder Structure

### Backend — `backend/src/marketplace/`
marketplace/
├── config/ # media.config.js — local vs future Cloudinary storage
├── constants/ # marketplace.constants.js — limits, defaults
├── enums/ # ProductStatus, OrderStatus, PaymentStatus, etc.
├── helpers/ # sku/slug generators, formatters, pagination/sort/filter builders
├── search/ # searchRequest/filter/sort/pagination models + queryBuilder
├── services/ # empty — populated once real business logic exists
├── validators/ # sku, price, discount, stock, image metadata
└── index.js # aggregated exports
### Frontend — `frontend/src/marketplace/`
marketplace/
├── constants/ # mirrored enums + marketplace.constants.js
├── utils/ # priceFormatter, mediaUrl, searchParams
├── services/ # marketplaceApi.js — thin wrapper over apiClient
├── hooks/ # useSearchQuery — foundation, not yet used by any page
├── context/ # MarketplaceContext — foundation, no provider mounted yet
└── types/ # JSDoc-style shape documentation (pre-TypeScript)
## Naming Conventions
- Enums: PascalCase object name, SCREAMING_SNAKE_CASE values (e.g. `ProductStatus.OUT_OF_STOCK`)
- Helpers/utils: `camelCase` function names, one concern per file
- Backend files: `name.type.js` (e.g. `sku.validator.js`, `slugGenerator.helper.js`)

## Why No Prisma Enums/Models Yet
Enums are implemented as plain JS objects (not Prisma schema enums) since no model currently references them. This avoids an unjustified migration. When Products/Orders/Sellers are introduced in later phases, these same enums become real Prisma `enum` declarations and the JS constants are either replaced or kept in sync — documented here as the intended migration path.

## Search Foundation
`marketplace/search/queryBuilder.js` composes `searchRequest.model.js` + `filterModel.js` + `sortModel.js` into a ready-to-use Prisma `{ where, orderBy, skip, take }` object. Future resource-specific search services (e.g. Product search) call `buildQuery(rawQuery, { searchFields, allowedSortFields })` rather than writing Prisma query logic from scratch.

## Media Foundation
All marketplace media (product images, brand logos, seller logos, store banners, category images) resolve their storage path and public URL through `marketplace/config/media.config.js` and `marketplace/helpers/mediaUrlHelper.helper.js`. Local disk storage today; migrating to Cloudinary later only requires changing these two files.

## Future Expansion Guidelines
- New resource (e.g. Product): add its Prisma model + real enum, add a `marketplace/services/product.service.js`, reuse existing validators/helpers/search foundation rather than duplicating logic.
- New enum: add to both `backend/src/marketplace/enums/` and `frontend/src/marketplace/constants/enums.js`, keep values identical on both sides.
- New constant: add to `marketplace.constants.js` on both sides — never hardcode limits inline in a service/component.