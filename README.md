# ZAF Cart

A professional, scalable shopping experience combining product discovery, seller tools, and dependable delivery in one retail platform. Built as an original platform — not a clone of any existing brand.

## Technology Stack

**Frontend:** Next.js (App Router), React, JavaScript, Tailwind CSS
**Backend:** Node.js, Express.js, REST API
**Database:** PostgreSQL with Prisma ORM
**Auth:** JWT, bcrypt (implementation begins in the Authentication milestone)

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

## Configuration

All environment variables are accessed through a centralized configuration layer — never `process.env` directly outside these files:

- **Backend:** `backend/src/config/` (`app.config.js`, `server.config.js`, `database.config.js`, `security.config.js`, aggregated via `index.js`)
- **Frontend:** `frontend/src/config/` (`app.config.js`, `api.config.js`, `pagination.config.js`, `theme.config.js`, `seo.config.js`, aggregated via `index.js`)

## Environment Variables

### Backend (`backend/.env`)
| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | `development` / `production` |
| `FRONTEND_URL` | Used for CORS |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` | Reserved for the Authentication milestone — not yet used |
| `BCRYPT_SALT_ROUNDS` | Reserved for the Authentication milestone — not yet used |
| `API_REQUEST_TIMEOUT_MS` | Reserved server-side request timeout config |

### Frontend (`frontend/.env.local`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the frontend API client targets |

## API Test Endpoints

- `GET /api/health` — server health check
- `GET /api/test` — used by the frontend to verify connectivity

## Code Standards

See [`docs/CODE_STANDARDS.md`](docs/CODE_STANDARDS.md) for naming conventions, import ordering, error-handling conventions, and commit message format.

## Development Workflow

1. Run backend (`npm run dev` in `backend/`) and frontend (`npm run dev` in `frontend/`) concurrently in separate terminals
2. Backend routes follow: `routes → controller → service → (future: Prisma via database/prismaClient.js)`
3. Frontend API calls go through `src/lib/apiClient.js`, never raw `fetch` in components
4. All constants/config live in `src/constants/` and `src/config/` — never hardcode values inline

## Development Data

The supported marketplace tables can be populated with development-only data:

```bash
cd backend
npm run db:seed
```

This command is guarded against production environments and resets the configured development database before reseeding it. See [`docs/DEVELOPMENT_DATA.md`](docs/DEVELOPMENT_DATA.md) for the dataset summary and local credentials.

## Current Phase Status

**Phase 5 — Global Configuration & Shared Infrastructure** ✅ Complete

## Roadmap

See the official 65-phase roadmap (Milestones 1–8: Foundation → Authentication → Seller & Marketplace → Shopping → Orders → Customer Experience → Dashboards → Production) tracked in project conversation history.