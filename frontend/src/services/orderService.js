import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';

export const orderService = {
  place: (checkoutSessionId) => apiClient.post('/orders', { checkoutSessionId }),
  listMine: (params = {}) => apiClient.get(`/orders${buildQueryString(params)}`),
  getMine: (id) => apiClient.get(`/orders/${id}`),
  cancelMine: (id, reason) => apiClient.post(`/orders/${id}/cancel`, { reason }),

  listSeller: (params = {}) => apiClient.get(`/seller/orders${buildQueryString(params)}`),
  getSeller: (id) => apiClient.get(`/seller/orders/${id}`),
  updateSellerStatus: (id, status, note) => apiClient.patch(`/seller/orders/${id}/status`, { status, note }),

  listAdmin: (params = {}) => apiClient.get(`/admin/orders${buildQueryString(params)}`),
  getAdmin: (id) => apiClient.get(`/admin/orders/${id}`),
  updateAdminStatus: (id, status, note) => apiClient.patch(`/admin/orders/${id}/status`, { status, note }),
};