import { apiClient } from '@/lib/apiClient';
import { apiConfig } from '@/config/api.config';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';

const sellerMediaBase = (productId) => `${API_ENDPOINTS.SELLER_PRODUCTS}/${productId}/media`;

async function multipartRequest(method, url, formData) {
  const token = tokenStorage.getAccessToken();
  const response = await fetch(`${apiConfig.baseUrl}${url}`, {
    method,
    headers: token ? { [AUTH_HEADER_NAME]: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const err = new Error(data.message || 'Request failed');
    err.statusCode = response.status;
    err.errorCode = data.errorCode;
    err.errors = data.errors || [];
    throw err;
  }
  return data;
}

export const mediaService = {
  upload: (productId, files, variantId) => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));
    if (variantId) formData.append('variantId', variantId);
    return multipartRequest('POST', sellerMediaBase(productId), formData);
  },
  list: (productId) => apiClient.get(sellerMediaBase(productId)),
  updateMetadata: (productId, mediaId, data) => apiClient.patch(`${sellerMediaBase(productId)}/${mediaId}`, data),
  setPrimary: (productId, mediaId) => apiClient.post(`${sellerMediaBase(productId)}/${mediaId}/primary`),
  reorder: (productId, order) => apiClient.put(`${sellerMediaBase(productId)}/reorder`, { order }),
  replace: (productId, mediaId, file) => {
    const formData = new FormData();
    formData.append('images', file);
    return multipartRequest('POST', `${sellerMediaBase(productId)}/${mediaId}/replace`, formData);
  },
  delete: (productId, mediaId) => apiClient.delete(`${sellerMediaBase(productId)}/${mediaId}`),

  getPublicMedia: (productId) => apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/media`),
};