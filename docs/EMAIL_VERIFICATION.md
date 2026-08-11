# Email Verification

## Flow
1. User registers via `POST /api/auth/register`
2. A verification token is generated, hashed, stored, and emailed (or logged to console in dev)
3. User clicks the link: `FRONTEND_URL/verify-email?token=<rawToken>`
4. Frontend calls `GET /api/auth/verify-email?token=...`
5. Backend validates the token (exists, unused, unexpired) and marks the user verified

## Endpoints
- `GET /api/auth/verify-email?token=<token>` — verifies a token
- `POST /api/auth/resend-verification` — body: `{ "email": "..." }`, always returns a generic success message

## Environment Variables
| Variable | Purpose |
|---|---|
| `EMAIL_HOST` | SMTP host; leave blank in dev to log emails to console instead of sending |
| `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS` | SMTP connection details |
| `EMAIL_FROM` | Sender address |
| `EMAIL_VERIFICATION_EXPIRES_HOURS` | Token lifetime (default 24) |

## Testing (development, no real SMTP needed)
Register a user, then check the backend terminal for a `[EMAIL - DEV MODE]` log containing the verification link — copy it into the browser to test the full flow without any email provider.

## Troubleshooting
- No dev-mode email log → check `EMAIL_HOST` is empty in `.env`
- "Invalid or expired" immediately → token copy/paste truncated, or frontend/backend URLs misconfigured
- Registration failing when email fails → should never happen; registration succeeds independently of email delivery by design