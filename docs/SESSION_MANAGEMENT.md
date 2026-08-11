# Authentication Session Management

## Lifecycle
1. **Login** issues an access token (returned in the JSON body, kept in frontend memory) and a refresh token (set as an `HttpOnly` cookie, path `/api/auth`).
2. **Every page load**, `AuthProvider` calls `POST /api/auth/refresh` to exchange the refresh cookie for a new access token — this is how the session survives a browser reload despite the access token living only in memory.
3. **Any 401** from a protected endpoint triggers one silent `refresh` + retry via `apiClient`'s `unauthorizedHandler` hook, before giving up and treating the user as logged out.
4. **Logout** revokes the current refresh token server-side and clears the cookie.

## Endpoints
| Endpoint | Purpose |
|---|---|
| `POST /api/auth/refresh` | Rotates the refresh token, returns a new access token + user |
| `POST /api/auth/logout` | Revokes the current refresh token, clears the cookie |
| `GET /api/auth/session` | Protected (`Authorization: Bearer`) — returns the current user, doubles as session validation |

## Security
See the Security Notes section of the Phase 11 implementation — covers rotation, replay detection, hashed storage, and cookie flags.

## Testing
See the Testing Steps section of the Phase 11 implementation — includes manual cookie inspection, rotation/replay verification, and expired-access-token recovery testing.