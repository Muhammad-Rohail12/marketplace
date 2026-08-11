import { apiClient } from '@/lib/apiClient';

export const checkoutService = {
  create: () => apiClient.post('/checkout'),
  get: (id) => apiClient.get(`/checkout/${id}`),
  cancel: (id) => apiClient.post(`/checkout/${id}/cancel`),
};