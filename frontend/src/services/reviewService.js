import { apiClient } from '@/lib/apiClient';

export const reviewService = {
  listByProduct: (productId) => apiClient.get(`/reviews/products/${productId}`),
  create: (productId, data) => apiClient.post(`/reviews/products/${productId}`, data),
  markHelpful: (id) => apiClient.post(`/reviews/${id}/helpful`),
};
