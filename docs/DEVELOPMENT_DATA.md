# Development Seed Data

The backend seed creates development/demo data for the supported marketplace schema. It is intended to populate local pages and API workflows without adding hardcoded product arrays to the frontend.

## Run

From the repository root:

```bash
cd backend
npm run db:seed
```

The command performs a controlled reset of the configured database and recreates the development dataset. It refuses to run when `NODE_ENV=production` or when `DATABASE_URL` appears to target production.

## Current Dataset

- 44 users: 30 buyers, 10 approved sellers, 2 admins, plus 2 seller applicants without approved seller records
- 87 categories, 30 brands, and 10 stores
- 360 products, 480 media records, 216 variants, 504 inventory records, and 504 prices
- 3 deals and 24 product discounts
- 30 fictional US addresses, 12 active buyer carts, and 240 converted checkout sessions
- 720 seller-scoped orders, order items, and status events across historical dates and statuses
- 500 development reviews, 120 authenticated wishlist entries, and 90 notifications

Reviews, wishlists, and notifications are now persisted through the new migration `20260820081136_add_reviews_wishlists_notifications`. Seller analytics are derived from order and inventory records through `/api/analytics/seller`; no fake analytics table is used. Sales-report exports and admin-wide analytics still require their dedicated UI/API work.

## Development Credentials

These credentials are for local development only and must never be reused in production:

| Role | Email | Password |
|---|---|---|
| Admin | `admin1@marketplace.test` | `MarketplaceDev!2026` |
| Seller | `seller01@marketplace.test` | `MarketplaceDev!2026` |
| Buyer | `buyer01@marketplace.test` | `MarketplaceDev!2026` |

Passwords are bcrypt-hashed before insertion. The seed does not print database credentials or secrets.