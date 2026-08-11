# User Profile & Account Management

## Endpoints (all require `Authorization: Bearer <accessToken>`)
| Endpoint | Purpose |
|---|---|
| `GET /api/users/me` | Current profile |
| `PATCH /api/users/me` | Partial update: firstName, lastName, phone, dateOfBirth, gender, preferredLanguage, timeZone |
| `POST /api/users/me/profile-image` | Multipart upload, field name `image` |
| `DELETE /api/users/me/profile-image` | Remove current photo |
| `POST /api/users/me/change-password` | `{currentPassword, newPassword, confirmNewPassword}` — revokes other sessions |
| `POST /api/users/me/deactivate` | `{password}` — sets status to INACTIVE, revokes all sessions, clears cookie |

## Profile Image Storage
Development: local disk at `uploads/profile-images/`, served statically at `/uploads/profile-images/<file>`. Production: intended to migrate to Cloudinary/object storage (later phase) — the service layer (`profileImage.service.js`) is the only place that would need to change.

## Password Change / Deactivation Session Behavior
Both actions revoke every `RefreshToken` row for the user (same pattern as Phase 13's reset-password), forcing re-login on any other device/browser.

## Testing
See Testing Steps in the Phase 14 implementation notes.

## Common Errors
See Common Errors table in the Phase 14 implementation notes.