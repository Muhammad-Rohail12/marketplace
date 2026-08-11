# Role-Based Authorization (RBAC)

## Roles
`BUYER`, `SELLER`, `ADMIN` — defined in `backend/src/constants/roles.js`. Adding a new role: add it to that enum-like object (and the Prisma `Role` enum + migration if it needs to be stored), then add its permission list to `rolePermissions.js` on both frontend and backend.

## Permission Matrix
| Permission | Buyer | Seller | Admin |
|---|---|---|---|
| Product.Read | ✅ | ✅ | ✅ |
| Product.Create/Update/Delete | ❌ | ✅ | ✅ |
| Order.Read | ✅ | ✅ | ✅ |
| Order.Update | ❌ | ✅ | ✅ |
| User.Read/Update (own) | ✅ | ✅ | ✅ |
| Seller.Manage | ❌ | ❌ | ✅ |
| Category.Manage | ❌ | ❌ | ✅ |
| Analytics.View | ❌ | ❌ | ✅ |
| System.Settings | ❌ | ❌ | ✅ |

## Backend Middleware
- `authenticate` (Phase 7) — requires a valid access token
- `authorize(...roles)` (Phase 7) — requires an exact role match
- `requirePermission(permission)` (Phase 15) — requires the role to hold a specific permission
- `requireOwnership(getOwnerId)` (Phase 15, foundation) — requires the requester to own the resource, or be admin
- `requireFreshAccount` (Phase 15) — re-checks role/status against the DB instead of trusting the JWT snapshot

Usage: `router.get('/path', authenticate, authorize(ROLES.ADMIN), controller)`

## Frontend
- `<ProtectedRoute allowedRoles={[...]} permission={...}>` — full-page guard, redirects to `/login` (unauthenticated) or `/forbidden` (wrong role/permission)
- `<RoleGuard allowedRoles={[...]}>` / `<PermissionGuard permission={...}>` — inline UI guards for showing/hiding smaller pieces of content

## Testing
See Testing Steps in the Phase 15 implementation notes — includes a dedicated `/account/access-check` verification page and matching backend `/api/demo/*` endpoints.