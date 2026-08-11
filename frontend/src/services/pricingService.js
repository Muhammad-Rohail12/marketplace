import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const SP = API_ENDPOINTS.SELLER_PRICING;
const P = API_ENDPOINTS.PRICING;

export const pricingService = {
  // Seller — price
  create: (productId, data) => apiClient.post(`${SP}/products/${productId}`, data),
  listMine: (params = {}) => apiClient.get(`${SP}${buildQueryString(params)}`),
  get: (id) => apiClient.get(`${SP}/${id}`),
  update: (id, data) => apiClient.patch(`${SP}/${id}`, data),
  getHistory: (id, params = {}) => apiClient.get(`${SP}/${id}/history${buildQueryString(params)}`),

  // Seller — discounts
  listDiscounts: (priceId) => apiClient.get(`${SP}/${priceId}/discounts`),
  createDiscount: (priceId, data) => apiClient.post(`${SP}/${priceId}/discounts`, data),
  updateDiscount: (id, data) => apiClient.patch(`${SP}/discounts/${id}`, data),
  deleteDiscount: (id) => apiClient.delete(`${SP}/discounts/${id}`),

  // Seller — deals
  listDeals: () => apiClient.get(`${SP}/deals`),
  createDeal: (data) => apiClient.post(`${SP}/deals`, data),
  getDeal: (id) => apiClient.get(`${SP}/deals/${id}`),
  addProductToDeal: (dealId, data) => apiClient.post(`${SP}/deals/${dealId}/products`, data),
  removeProductFromDeal: (discountId) => apiClient.delete(`${SP}/deals/discounts/${discountId}`),
  setDealEnabled: (dealId, isEnabled) => apiClient.patch(`${SP}/deals/${dealId}/enabled`, { isEnabled }),

  // Admin
  listAll: (params = {}) => apiClient.get(`${P}${buildQueryString(params)}`),
  adminAdjust: (id, data) => apiClient.post(`${P}/${id}/adjust`, data),

  // Public
  getProductPricing: (productId) => apiClient.get(`${P}/products/${productId}`),
  getVariantPricing: (variantId) => apiClient.get(`${P}/variants/${variantId}`),
  getPricingBatch: (productIds) => apiClient.get(`${P}/batch?productIds=${productIds.join(',')}`),
};