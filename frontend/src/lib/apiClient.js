import { apiConfig } from '@/config/api.config';

class ApiError extends Error {
  constructor(message, statusCode, errors = [], errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.errorCode = errorCode;
  }
}

const requestInterceptors = [];
const responseInterceptors = [];
let unauthorizedHandler = null;

// Endpoints excluded from the automatic 401 -> refresh -> retry cycle,
// to avoid infinite loops when an auth bootstrap call itself fails.
const AUTH_BOOTSTRAP_PATHS = ['/auth/refresh', '/auth/login', '/auth/logout', '/auth/register'];

export function addRequestInterceptor(fn) {
  requestInterceptors.push(fn);
}

export function addResponseInterceptor(fn) {
  responseInterceptors.push(fn);
}

// Registered once by authService — called whenever a protected
// request receives a 401, before retrying it exactly once.
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

async function request(
  path,
  { method = 'GET', body, headers = {}, timeoutMs = apiConfig.timeoutMs, _isRetry = false, ...rest } = {}
) {
  let requestConfig = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // required so the httpOnly refresh-token cookie is sent/received
    ...rest,
  };

  for (const interceptor of requestInterceptors) {
    requestConfig = await interceptor(requestConfig);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;

  try {
    response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...requestConfig,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out', 0);
    }
    throw new ApiError('Network error — could not reach the server', 0);
  } finally {
    clearTimeout(timeoutId);
  }

  let data = await response.json().catch(() => ({}));

  for (const interceptor of responseInterceptors) {
    data = await interceptor(data, response);
  }

  if (!response.ok || data.success === false) {
    const isBootstrapPath = AUTH_BOOTSTRAP_PATHS.some((p) => path.startsWith(p));

    if (response.status === 401 && !_isRetry && !isBootstrapPath && unauthorizedHandler) {
      try {
        await unauthorizedHandler();
        return request(path, { method, body, headers, timeoutMs, _isRetry: true, ...rest });
      } catch {
        // Refresh also failed — fall through and throw the original error.
      }
    }

    throw new ApiError(data.message || 'Request failed', response.status, data.errors || [], data.errorCode || null);
  }

  return data;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { ApiError };