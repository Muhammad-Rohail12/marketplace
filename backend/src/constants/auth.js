module.exports = {
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
  },
  HEADER_NAMES: {
    AUTHORIZATION: 'authorization',
  },
  COOKIE_NAMES: {
    REFRESH_TOKEN: 'refreshToken',
  },
  AUTH_MESSAGES: {
    TOKEN_MISSING: 'Authentication token missing',
    TOKEN_INVALID: 'Invalid authentication token',
    TOKEN_EXPIRED: 'Authentication token has expired',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to perform this action',
  },
};