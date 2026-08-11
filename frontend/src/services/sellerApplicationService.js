import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const BASE = API_ENDPOINTS.SELLER_APPLICATIONS;

export const sellerApplicationService = {
  getOrCreateDraft: () => apiClient.get(`${BASE}/me`),
  getMyApplication: () => apiClient.get(`${BASE}/me/current`),
  updateDraft: (id, data) => apiClient.patch(`${BASE}/${id}`, data),
  submit: (id, data) => apiClient.post(`${BASE}/${id}/submit`, data),
  cancel: (id) => apiClient.post(`${BASE}/${id}/cancel`),

  list: (params = {}) => apiClient.get(`${BASE}${buildQueryString(params)}`),
  get: (id) => apiClient.get(`${BASE}/${id}`),
  startReview: (id) => apiClient.post(`${BASE}/${id}/review`),
  approve: (id, adminNotes) => apiClient.post(`${BASE}/${id}/approve`, { adminNotes }),
  reject: (id, rejectionReason) => apiClient.post(`${BASE}/${id}/reject`, { rejectionReason }),
  suspend: (id, adminNotes) => apiClient.post(`${BASE}/${id}/suspend`, { adminNotes }),
};