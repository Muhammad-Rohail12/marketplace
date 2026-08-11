# Seller Application & Approval System

## Lifecycle
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → SUSPENDED
↘ CANCELLED ↘ REJECTED
Transitions enforced via `backend/src/seller/constants/sellerApplication.constants.js: ALLOWED_TRANSITIONS` — the single source of truth.

## Database
`SellerApplication` (business info, status, review metadata, optimistic `version` field) + `SellerApplicationAuditEvent` (append-only action log).

## API
See the API Contract table in the Phase 20 implementation notes. Base path: `/api/seller-applications`.

## Permission Matrix
| Permission | Buyer | Seller | Admin |
|---|---|---|---|
| Create/ReadOwn/UpdateOwn/Submit/Cancel | ✅ | — | ✅ |
| ReadOwn (existing application) | — | ✅ | ✅ |
| ReadAll/Review/Approve/Reject/Suspend | ❌ | ❌ | ✅ |

## Approval Workflow
Admin: SUBMITTED → (Start Review) → UNDER_REVIEW → (Approve) → APPROVED. Approval is atomic: application status + `User.role = SELLER` + audit event all commit together or all roll back.

## Rejection Workflow
UNDER_REVIEW → (Reject + required reason) → REJECTED. `rejectionReason` is applicant-visible; `adminNotes` is admin-only and never returned to the applicant.

## Seller Role Activation
Reuses the existing `Role` enum and RBAC system from Phase 15 — no separate role mechanism. Role changes only happen inside `sellerApplication.service.js`'s admin-only transactions.

## Security Model
Ownership enforced at the service layer using `req.user.id` from the authenticated JWT, independent of route-level role checks — prevents IDOR even if route middleware were misconfigured. See Security Notes in the Phase 20 implementation notes for full detail.

## Testing
See Testing Steps in the Phase 20 implementation notes.