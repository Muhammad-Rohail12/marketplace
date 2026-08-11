import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const A = API_ENDPOINTS.ADDRESSES;

export const addressService = {
  list: () => apiClient.get(A),
  get: (id) => apiClient.get(`${A}/${id}`),
  create: (data) => apiClient.post(A, data),
  update: (id, data) => apiClient.patch(`${A}/${id}`, data),
  setDefault: (id) => apiClient.patch(`${A}/${id}/default`),
  remove: (id) => apiClient.delete(`${A}/${id}`),
};