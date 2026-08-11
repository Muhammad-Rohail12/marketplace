# User Login

## Flow
1. User submits email + password to `POST /api/auth/login`
2. Backend verifies: user exists → password matches → account is `ACTIVE` → email is verified
3. On success, a JWT access token is issued and returned in the response body
4. Frontend stores the token in memory (`tokenStorage`) and attaches it to future requests via `Authorization: Bearer <token>`

## Endpoint
`POST /api/auth/login`
Request: `{ "email": "...", "password": "..." }`
Success `200`: `{ data: { user, accessToken } }`

## Failure Cases
| Case | Status | errorCode |
|---|---|---|
| Wrong email or password | 401 | `INVALID_CREDENTIALS` |
| Account disabled/suspended | 403 | `ACCOUNT_DISABLED` |
| Email not verified | 403 | `EMAIL_NOT_VERIFIED` |
| Validation failure | 422 | `VALIDATION_FAILED` |

## Testing
Use a user verified via the Phase 9 email verification flow. Test wrong password, unknown email, unverified account, and disabled account (toggle `status` in Prisma Studio) to confirm each returns the correct `errorCode`.

## Common Errors
See the Common Errors table in the Phase 10 implementation notes — most issues trace back to an empty `JWT_SECRET` or an unverified/未hashed password from testing shortcuts.