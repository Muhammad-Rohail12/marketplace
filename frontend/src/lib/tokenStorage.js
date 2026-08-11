// In-memory access-token storage. Kept in memory only (not
// localStorage) to reduce XSS exposure. Refresh tokens will live in
// an httpOnly cookie set by the backend once the login endpoint
// exists (Milestone 2) — no frontend storage needed for those.
let accessToken = null;

export const tokenStorage = {
  getAccessToken: () => accessToken,
  setAccessToken: (token) => {
    accessToken = token;
  },
  clearAccessToken: () => {
    accessToken = null;
  },
};
