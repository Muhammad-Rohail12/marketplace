import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const C = API_ENDPOINTS.CART;

export const cartService = {
  get: () => apiClient.get(C),
  getCount: () => apiClient.get(`${C}/count`),
  addItem: (data) => apiClient.post(`${C}/items`, data),
  updateItem: (itemId, quantity) => apiClient.patch(`${C}/items/${itemId}`, { quantity }),
  removeItem: (itemId) => apiClient.delete(`${C}/items/${itemId}`),
  clear: () => apiClient.delete(C),
  validate: () => apiClient.post(`${C}/validate`),
  selectDeliveryAddress: (addressId) => apiClient.patch(`${C}/delivery-address`, { addressId }),
};