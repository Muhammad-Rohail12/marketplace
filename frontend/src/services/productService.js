import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const SP = API_ENDPOINTS.SELLER_PRODUCTS;
const P = API_ENDPOINTS.PRODUCTS;

export const productService = {
  // Seller
  create: (data) => apiClient.post(SP, data),
  listMine: (params = {}) => apiClient.get(`${SP}${buildQueryString(params)}`),
  getMine: (id) => apiClient.get(`${SP}/${id}`),
  update: (id, data) => apiClient.patch(`${SP}/${id}`, data),
  updateAttributes: (id, attributeValues) => apiClient.put(`${SP}/${id}/attributes`, { attributeValues }),
  updateSpecifications: (id, specifications) => apiClient.put(`${SP}/${id}/specifications`, { specifications }),
  createVariant: (id, data) => apiClient.post(`${SP}/${id}/variants`, data),
  updateVariant: (id, variantId, data) => apiClient.patch(`${SP}/${id}/variants/${variantId}`, data),
  deleteVariant: (id, variantId) => apiClient.delete(`${SP}/${id}/variants/${variantId}`),
  submit: (id) => apiClient.post(`${SP}/${id}/submit`),
  archive: (id) => apiClient.post(`${SP}/${id}/archive`),
  duplicate: (id) => apiClient.post(`${SP}/${id}/duplicate`),

  // Admin
  listAll: (params = {}) => apiClient.get(`${P}${buildQueryString(params)}`),
  get: (id) => apiClient.get(`${P}/${id}`),
  approve: (id) => apiClient.post(`${P}/${id}/approve`),
  reject: (id, rejectionReason) => apiClient.post(`${P}/${id}/reject`, { rejectionReason }),
  deactivate: (id) => apiClient.post(`${P}/${id}/deactivate`),
  adminArchive: (id) => apiClient.post(`${P}/${id}/archive`),

  // Public
  getPublic: (slug) => apiClient.get(`${P}/slug/${encodeURIComponent(slug)}`),
  listByCategory: (categoryId, params = {}) => apiClient.get(`${P}/category/${categoryId}${buildQueryString(params)}`),
  listByBrand: (brandId, params = {}) => apiClient.get(`${P}/brand/${brandId}${buildQueryString(params)}`),
  getRelated: (id) => apiClient.get(`${P}/${id}/related`),
};