import { apiClient } from '@/lib/apiClient';
import { apiConfig } from '@/config/api.config';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';
import { buildQueryString } from '@/utils/queryString';

export async function listBrands(params = {}) {
  return apiClient.get(`${API_ENDPOINTS.BRANDS}${buildQueryString(params)}`);
}

export async function getFeaturedBrands() {
  return apiClient.get(API_ENDPOINTS.BRANDS_FEATURED);
}

export async function getHomepageBrands() {
  return apiClient.get(API_ENDPOINTS.BRANDS_HOMEPAGE);
}

export async function getVerifiedBrands() {
  return apiClient.get(API_ENDPOINTS.BRANDS_VERIFIED);
}

export async function getBrandBySlug(slug) {
  return apiClient.get(`${API_ENDPOINTS.BRANDS}/slug/${encodeURIComponent(slug)}`);
}

async function submitBrandForm(method, url, formData) {
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

export async function createBrand(formData) {
  return submitBrandForm('POST', API_ENDPOINTS.BRANDS, formData);
}

export async function updateBrand(id, formData) {
  return submitBrandForm('PATCH', `${API_ENDPOINTS.BRANDS}/${id}`, formData);
}

export async function deleteBrand(id) {
  return apiClient.delete(`${API_ENDPOINTS.BRANDS}/${id}`);
}

export async function restoreBrand(id) {
  return apiClient.post(`${API_ENDPOINTS.BRANDS}/${id}/restore`);
}