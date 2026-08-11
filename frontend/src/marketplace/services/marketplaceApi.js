import { apiClient } from '@/lib/apiClient';

// Foundation wrapper — future Product/Category/Order services will
// call through here (or extend this pattern) instead of importing
// apiClient directly, keeping all marketplace API calls discoverable
// in one place.
export const marketplaceApi = {
  get: (path, options) => apiClient.get(path, options),
  post: (path, body, options) => apiClient.post(path, body, options),
  patch: (path, body, options) => apiClient.patch(path, body, options),
  delete: (path, options) => apiClient.delete(path, options),
};