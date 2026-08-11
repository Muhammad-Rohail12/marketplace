# Reset Password

## Flow
1. User arrives via the link from Phase 12's forgot-password email: `FRONTEND_URL/reset-password?token=<rawToken>`
2. Frontend collects new password + confirmation, submits to `POST /api/auth/reset-password`
3. Backend validates the token (exists, correct type, unused, unexpired), then in one transaction:
   - Hashes and updates the password
   - Marks the reset token as used
   - Revokes all active refresh tokens (sessions) for that user
4. User is redirected to `/login` and must sign in with the new password

## Endpoint
`POST /api/auth/reset-password`
Request: `{ "token": "...", "password": "...", "confirmPassword": "..." }`
Success `200`: generic message, no auto-login

## Token Validation
Reuses the `VerificationToken` model (`type: PASSWORD_RESET`) introduced in Phase 12. Checked for: existence, correct type, not used, not expired.

## Session Invalidation
All rows in `RefreshToken` for the user are set to `revokedAt: now()` — any device with an active session will fail its next `/auth/refresh` call and be forced to log in again.

## Testing
See Testing Steps in the Phase 13 implementation notes — includes verifying old password stops working, new password works, and existing browser sessions get logged out.

## Common Errors
See Common Errors table in the Phase 13 implementation notes.
