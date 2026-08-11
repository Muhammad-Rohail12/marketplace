import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const shippingService = {
  listMethods: () => apiClient.get('/shipping/methods'),

  // Seller
  getMySettings: () => apiClient.get('/seller/shipping/settings'),
  updateMySettings: (data) => apiClient.put('/seller/shipping/settings', data),
  listMyRates: () => apiClient.get('/seller/shipping/rates'),
  createMyRate: (data) => apiClient.post('/seller/shipping/rates', data),
  updateMyRate: (id, data) => apiClient.patch(`/seller/shipping/rates/${id}`, data),
  deleteMyRate: (id) => apiClient.delete(`/seller/shipping/rates/${id}`),
};

export const cartShippingSelect = (storeId, shippingMethodId) =>
  apiClient.patch(`${API_ENDPOINTS.CART}/shipping`, { storeId, shippingMethodId });