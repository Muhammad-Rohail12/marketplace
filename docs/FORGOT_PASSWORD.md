# Forgot Password (Account Recovery Request)

## Flow
1. User submits their email to `POST /api/auth/forgot-password`
2. Backend always responds with the same generic success message, regardless of whether the account exists
3. If the account exists, a password reset token is generated, hashed, stored (reusing the `VerificationToken` model with `type: PASSWORD_RESET`), and emailed
4. The actual password change happens via a separate endpoint in Phase 13 — this phase only sends the email

## Endpoint
`POST /api/auth/forgot-password`
Request: `{ "email": "..." }`
Response (always, regardless of email validity): `200` with a generic message

## Token Lifecycle
- Generated as 32 random bytes, only the SHA-256 hash is stored
- Expires after `PASSWORD_RESET_EXPIRES_MINUTES` (default 30)
- Requesting a new reset invalidates all previous unused reset tokens for that user
- Consumed (marked `usedAt`) upon successful reset — implemented in Phase 13

## Environment Variables
| Variable | Purpose |
|---|---|
| `PASSWORD_RESET_EXPIRES_MINUTES` | Reset token lifetime (default 30) |
| `EMAIL_HOST`, etc. | Reused from Phase 9 email infrastructure |

## Testing
See Testing Steps in the Phase 12 implementation notes — in development (blank `EMAIL_HOST`), check the backend terminal for the `[EMAIL - DEV MODE]` log containing the real reset link.

## Common Errors
See Common Errors table in the Phase 12 implementation notes.