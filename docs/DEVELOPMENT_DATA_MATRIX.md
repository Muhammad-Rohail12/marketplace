# Development Data Matrix

**Scope:** Chunk 1, database and seed audit only.

This document describes the verified development database baseline and the data plan for the later development-seeding chunks. It is development documentation, not a production-data specification.

## Audit Evidence

- Prisma datasource: PostgreSQL, loaded from `DATABASE_URL`.
- Prisma migrations: 18 migration directories are present and `prisma migrate status` reports the database is up to date.
- Prisma schema: 62 models and 18 enums are defined in `backend/prisma/schema.prisma`.
- Seed architecture: no `seed.js`, seed directory, Prisma seed configuration, or database seed script currently exists.
- Backend package scripts: only `dev` and `start` exist. No seed, reset, or Prisma generation script is currently defined.
- Frontend data path: the real services use `apiClient` and the backend REST routes. The mock files under `frontend/src/services/mock/` are not imported by application code; they remain unused fallback/demo modules.
- Image strategy: product and store media use database records referencing the existing local upload infrastructure (`uploads/`).
- Password strategy: authentication hashes passwords through `backend/src/auth/utils/password.util.js`, backed by bcrypt and the configured salt rounds.

## Current Development Database

Counts were queried from the configured local PostgreSQL database on 2026-08-20. Existing rows are not assumed to be production data.

| Area | Current count | Later target | Seed support | Notes |
|---|---:|---:|---|---|
| Users | 2 | 31+ | Yes | 1 ADMIN and 1 BUYER currently exist. |
| Buyers | 1 | 20-50 | Yes | Existing buyer is unverified. |
| Sellers | 1 | 10-20 | Yes | Existing seller belongs to the existing admin user. |
| Admins | 1 | 1-3 | Yes | Existing admin is active and verified. |
| Seller applications | 1 | 10-20 | Yes | Existing application is APPROVED. |
| Stores | 1 | 10-20 | Yes | Existing store is active but has the display name `[slug]`; later reseeding must define whether controlled cleanup removes it. |
| Categories | 2 | 87 | Yes | Existing parent/child taxonomy is `Wireless earbuds` -> `Ronin`; the seed creates 15 parents and 72 children. |
| Brands | 0 | 20-50 | Yes | No brand data exists. |
| Attribute groups | 1 | Existing plus needed values | Yes | Foundation exists. |
| Attributes | 3 | Existing plus category-specific values | Yes | `color`, `size`, and `weight` exist. |
| Attribute values | 4 | 50+ | Yes | Existing values need to be reused where compatible. |
| Products | 1 | 300-500 | Yes | Existing product `Merry` is ARCHIVED and has no brand. |
| Product media | 0 | 300+ primary images | Yes | Must use valid local or stable development-safe references. |
| Variants | 0 | 500-1,000 | Yes | Variant option foundation exists, but no combinations exist. |
| Inventory | 0 | 300+ plus variant inventory | Yes | Need IN_STOCK, LOW_STOCK, and OUT_OF_STOCK coverage. |
| Product prices | 0 | 300+ plus variant prices | Yes | Schema default currency is PKR; seed policy must choose the project-supported development currency deliberately. |
| Deals/discounts | 0 | Active, scheduled, expired | Yes | Supported by `Deal` and `Discount`. |
| Carts/cart items | 0 | Selected buyer carts | Yes | Useful for account/cart demos; must remain valid for the seeded buyer. |
| Addresses | 0 | Multiple per buyer | Yes | Use fictional US development addresses. |
| Shipping methods/rates | 0 | Platform and seller rates | Yes | Required for checkout data to be usable. |
| Tax rates | 8 | Existing plus required states | Yes | Existing state rows should be reused and validated. |
| Checkout sessions | 0 | Optional historical/current fixtures | Yes | Orders require a checkout session. |
| Orders | 0 | 200-500 | Yes | Order rows are seller-scoped. Multi-vendor checkout requires multiple orders sharing one checkout session. |
| Order items | 0 | 1,000+ | Yes | Must snapshot product/variant data and reference real inventory IDs. |
| Order status events | 0 | Events for seeded orders | Yes | Use only the actual `OrderStatus` enum values. |
| Reviews | 500 | 300-1,000 requested | Yes | Backed by `Review`, product review routes, and the product detail UI. |
| Wishlists | 120 | Buyer product saves requested | Yes | Backed by `WishlistItem`, authenticated CRUD routes, and the account/product UI. |
| Notifications | 90 | Account/admin notifications requested | Yes | Backed by `Notification` and authenticated read/read-all routes. |
| Promotions/featured products | Partial | Homepage/deals requested | Partial | Deals and category/brand/store flags exist; no separate promotion or product-feature model exists. |
| Analytics/sales reports | Seller analytics endpoint | Derived from orders/inventory | Partial | `/api/analytics/seller` is available; admin analytics and sales-report export are not implemented. |

## Schema Dependency Plan

| Later chunk | Records | Required dependency order | Primary schema models |
|---|---|---|---|
| 2 | Buyers, sellers, admins, applications | Users -> applications -> sellers -> stores | `User`, `SellerApplication`, `Seller`, `Store`, `StorePolicy` |
| 3 | Taxonomy and brands | Parent categories -> child categories -> brands -> brand/category links | `Category`, `Brand`, `BrandCategory` |
| 4 | Catalog | Categories/brands/sellers/stores -> products | `Product`, `ProductSpecificationValue`, `ProductAttributeValue` |
| 5 | Media and variants | Products -> variant options -> combinations -> media | `VariantOption`, `VariantCombination`, `VariantCombinationOption`, `ProductMedia` |
| 6 | Inventory and prices | Products/variants -> inventory and price records | `Inventory`, `StockMovement`, `ProductPrice`, `PriceHistory` |
| 7 | Deals and shipping | Sellers/products/prices -> deals/discounts and shipping configuration | `Deal`, `Discount`, `ShippingMethod`, `ShippingRate`, `SellerShippingSettings`, `StateTaxRate` |
| 8 | Orders | Buyers/addresses/cart/inventory/shipping -> checkout -> seller orders -> items/events | `Cart`, `CartItem`, `Address`, `CheckoutSession`, `CheckoutInventoryReservation`, `Order`, `OrderItem`, `OrderStatusEvent` |
| 9+ | Analytics and reports | Derived order/inventory metrics; dedicated report UI remains | Seller analytics endpoint; admin analytics and sales-report export remain |

## Verified Constraints

- `User.email`, category slug, brand slug, store slug, product slug, order number, and relevant configuration codes are unique.
- Product SKU and barcode uniqueness is scoped per seller, not globally.
- A seller and store each have a one-to-one relationship with their user/seller.
- Products require a seller, store, and category; a brand is optional.
- Variant inventory and pricing use unique nullable `variantId` fields. Simple-product uniqueness is enforced by service behavior because the schema cannot express the intended partial unique constraint portably.
- `Order` requires `checkoutSessionId`, buyer, seller, store, immutable shipping fields, and reconciled monetary totals.
- An order represents one seller. A multi-vendor checkout must therefore create one order per seller while reusing the checkout session.
- `OrderItem.inventoryId` is required by the schema but has no Prisma relation field; seed code must still resolve and persist the correct inventory ID.
- Product media requires URL, storage key, original filename, filename, MIME type, and file size.
- Passwords must be bcrypt hashes generated with the existing password utility; plaintext passwords must never be persisted.
- Only the actual enum values in `schema.prisma` may be used. In particular, order statuses are `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, and `REFUNDED`.

## Existing Records To Handle Later

The later seed implementation must choose and document a controlled development reset policy for the two existing users and their dependent records. It must not silently delete arbitrary data or run in production. The currently observed records are:

- Admin: `funtime.jani12@gmail.com`, active and email-verified.
- Buyer: `mrrohail018@gmail.com`, active and email-unverified.
- Seller application: `CGT Developing Hub`, APPROVED.
- Store: slug `cgt-developing-hub`, ACTIVE, display name `[slug]`.
- Category tree: `wireless-earbuds` with child `ronin`.
- Product: slug `merry`, ARCHIVED, SKU `sdr`, with no brand.

No passwords or database secrets are recorded in this matrix.

## Planned Files For Later Chunks

These files are a plan, not changes made in Chunk 1. Exact module boundaries may be adjusted after the first seed implementation is tested.

| File | Planned action | Purpose |
|---|---|---|
| `backend/prisma/seed.js` | Created | Development-only entry point, environment/database guard, controlled reset, generated records, and summary logging. |
| `backend/prisma/seed/fixtures.js` | Create | Small structured catalog, taxonomy, brand, seller, address, and status definitions; no frontend data. |
| `backend/prisma/seed/passwords.js` | Create | Development-only credential constants and bcrypt hashing through the existing utility or equivalent configured helper. |
| `backend/package.json` | Modify | Add only verified seed/generation commands after the seed command exists. |
| `backend/README.md` or `docs/DEVELOPMENT_DATA.md` | Create or modify | Seed purpose, command, reset policy, safe test credentials, and production warning. |
| `README.md` | Modify if needed | Link to development seed documentation and actual commands. |
| `backend/prisma/schema.prisma` | Modify only if approved | Only for separately approved unsupported domains such as reviews, wishlists, or notifications. Not required for the supported seed chunks. |
| `backend/prisma/migrations/*` | Create only with schema changes | Migration files must be generated by Prisma, never hand-invented for seed data. |
| `frontend/src/services/mock/*` | Modify only after API verification | Remove or disable a mock path only when a real backend API already serves the same page data. |

## Seed Implementation Outcome

The supported marketplace graph and the newly added review, wishlist, and notification domains are populated by `backend/prisma/seed.js`. Seller analytics are available as derived API data. Admin analytics, sales-report export, and full browser workflow validation remain follow-up work.