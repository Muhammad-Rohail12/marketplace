# Marketplace

A professional, scalable multi-vendor e-commerce marketplace combining large-marketplace product discovery/seller ecosystem functionality with a practical, delivery-oriented retail/grocery shopping experience. Built as an original platform — not a clone of any existing brand.

## Technology Stack

**Frontend:** Next.js (App Router), React, JavaScript, Tailwind CSS
**Backend:** Node.js, Express.js, REST API
**Database:** PostgreSQL with Prisma ORM (added in Phase 2)
**Auth:** JWT, bcrypt (added in Phase 4)

## Project Structure
Marketplace/
├── frontend/ # Next.js app
├── backend/ # Express REST API
├── docs/ # Project documentation
├── design/ # Design assets
├── uploads/ # Local file storage (dev only)
└── README.md
## Prerequisites

- Node.js LTS
- npm
- PostgreSQL (running locally, database `marketplace_db` created)
- Git

## Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Runs on `http://localhost:3000`

## API Test Endpoints

- `GET /api/health` — server health check
- `GET /api/test` — used by the frontend to verify connectivity

## Current Phase Status

**Phase 1 — Development Environment and Initial Project Setup** ✅ Complete

## Roadmap

| Phase | Description |
|---|---|
| 0 | Project planning and architecture |
| 1 | Dev environment & initial setup ✅ |
| 2 | Database architecture & Prisma foundation |
| 3 | Backend foundation & REST API architecture |
| 4 | Authentication and authorization |
| 5 | User profiles and addresses |
| 6 | Categories and product catalog |
| 7 | Seller product management |
| 8 | Product images and media |
| 9 | Search, filtering, sorting, pagination |
| 10 | Product details, ratings, reviews |
| 11 | Shopping cart |
| 12 | Wishlist |
| 13 | Checkout and delivery addresses |
| 14 | Orders and order lifecycle |
| 15 | Seller dashboard |
| 16 | Admin dashboard |
| 17 | Inventory and stock management |
| 18 | Delivery and order tracking |
| 19 | Payment integration |
| 20 | Email and notifications |
| 21 | Promotions, discounts, coupons |
| 22 | Professional frontend UX & responsive design |
| 23 | AI features |
| 24 | Security hardening |
| 25 | Testing |
| 26 | Performance optimization |
| 27 | Deployment |
| 28 | Monitoring and maintenance |