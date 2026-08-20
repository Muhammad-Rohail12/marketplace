import { apiClient } from '@/lib/apiClient';

export const analyticsService = {
  sellerOverview: () => apiClient.get('/analytics/seller'),
};