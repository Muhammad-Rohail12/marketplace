# Deployment Guide — Frontend (Phase 50)

## Environment Variables (production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_USE_MOCK_DATA=false

## Build & Verify Locally
```bash
cd frontend
npm run build
npm run start
```
Confirm no build errors, then smoke-test the core flows from `FRONTEND_QA_CHECKLIST.md` against the production build locally before deploying.

## Image Hosting Note
`next.config.js`'s `images.remotePatterns` is derived from `NEXT_PUBLIC_API_URL` — if the backend's upload origin changes (e.g. moving to a CDN/S3 in a later phase), update that env var and this config will follow automatically without a code change.

## What Is and Isn't Live at This Phase
This is a **frontend-complete, backend-partially-integrated** build (Phases 1-30 backend + Phases 31-50 UI). Real, working end-to-end: auth, catalog, cart, checkout, orders, seller/admin management. **Not yet live**: real payment capture, real reviews, coupon backend — see the QA checklist's "Known Gaps" section. Do not present this build publicly as accepting real payments.