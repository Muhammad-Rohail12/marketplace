import { apiClient } from '@/lib/apiClient';

export const wishlistService = {
  list: () => apiClient.get('/wishlist'),
  add: (productId) => apiClient.post('/wishlist', { productId }),
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`),
};
