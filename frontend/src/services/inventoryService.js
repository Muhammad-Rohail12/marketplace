import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const SI = API_ENDPOINTS.SELLER_INVENTORY;
const I = API_ENDPOINTS.INVENTORY;

export const inventoryService = {
  create: (productId, data) => apiClient.post(`${SI}/products/${productId}`, data),
  listMine: (params = {}) => apiClient.get(`${SI}${buildQueryString(params)}`),
  getSummary: () => apiClient.get(`${SI}/summary`),
  get: (id) => apiClient.get(`${SI}/${id}`),
  adjust: (id, data) => apiClient.post(`${SI}/${id}/adjust`, data),
  restock: (id, data) => apiClient.post(`${SI}/${id}/restock`, data),
  updateThreshold: (id, data) => apiClient.patch(`${SI}/${id}/threshold`, data),
  getHistory: (id, params = {}) => apiClient.get(`${SI}/${id}/history${buildQueryString(params)}`),

  listAll: (params = {}) => apiClient.get(`${I}${buildQueryString(params)}`),
  adminAdjust: (id, data) => apiClient.post(`${I}/${id}/adjust`, data),
  adminGetHistory: (id, params = {}) => apiClient.get(`${I}/${id}/history${buildQueryString(params)}`),

  getProductAvailability: (productId) => apiClient.get(`${I}/products/${productId}/availability`),
  getVariantAvailability: (variantId) => apiClient.get(`${I}/variants/${variantId}/availability`),
};