import { apiClient } from '@/lib/apiClient';
import { apiConfig } from '@/config/api.config';
import { buildQueryString } from '@/utils/queryString';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';

export const storeService = {
  getMySellerProfile: () => apiClient.get(API_ENDPOINTS.SELLER_PROFILE),
  getMyStore: () => apiClient.get(API_ENDPOINTS.SELLER_STORE),
  updateMyStore: (data) => apiClient.patch(API_ENDPOINTS.SELLER_STORE, data),
  updatePolicies: (policies) => apiClient.put(`${API_ENDPOINTS.SELLER_STORE}/policies`, { policies }),

  async updateMedia(files) {
    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => file && formData.append(key, file));

    const token = tokenStorage.getAccessToken();
    const response = await fetch(`${apiConfig.baseUrl}${API_ENDPOINTS.SELLER_STORE}/media`, {
      method: 'POST',
      headers: token ? { [AUTH_HEADER_NAME]: `Bearer ${token}` } : {},
      credentials: 'include',
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      const err = new Error(data.message || 'Upload failed');
      err.statusCode = response.status;
      err.errorCode = data.errorCode;
      err.errors = data.errors || [];
      throw err;
    }
    return data;
  },

  getPublicStore: (slug) => apiClient.get(`${API_ENDPOINTS.STORES}/slug/${encodeURIComponent(slug)}`),

  list: (params = {}) => apiClient.get(`${API_ENDPOINTS.STORES}${buildQueryString(params)}`),
  get: (id) => apiClient.get(`${API_ENDPOINTS.STORES}/${id}`),
  suspend: (id) => apiClient.post(`${API_ENDPOINTS.STORES}/${id}/suspend`),
  activate: (id) => apiClient.post(`${API_ENDPOINTS.STORES}/${id}/activate`),
  feature: (id, isFeatured) => apiClient.patch(`${API_ENDPOINTS.STORES}/${id}/feature`, { isFeatured }),
};