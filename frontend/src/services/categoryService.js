import { apiClient } from '@/lib/apiClient';
import { apiConfig } from '@/config/api.config';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';
import { buildQueryString } from '@/utils/queryString';

export async function listCategories(params = {}) {
  return apiClient.get(`${API_ENDPOINTS.CATEGORIES}${buildQueryString(params)}`);
}

export async function getCategoryTree(params = {}) {
  return apiClient.get(`${API_ENDPOINTS.CATEGORIES_TREE}${buildQueryString(params)}`);
}

export async function getFeaturedCategories() {
  return apiClient.get(API_ENDPOINTS.CATEGORIES_FEATURED);
}

export async function getHomepageCategories() {
  return apiClient.get(API_ENDPOINTS.CATEGORIES_HOMEPAGE);
}

export async function getNavigationCategories() {
  return apiClient.get(API_ENDPOINTS.CATEGORIES_NAVIGATION);
}

export async function getCategoryBySlug(slug) {
  return apiClient.get(`${API_ENDPOINTS.CATEGORIES}/slug/${encodeURIComponent(slug)}`);
}

export async function getCategoryBreadcrumb(id) {
  return apiClient.get(`${API_ENDPOINTS.CATEGORIES}/${id}/breadcrumb`);
}

export async function getCategoryChildren(id) {
  return apiClient.get(`${API_ENDPOINTS.CATEGORIES}/${id}/children`);
}

async function submitCategoryForm(method, url, formData) {
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

export async function createCategory(formData) {
  return submitCategoryForm('POST', API_ENDPOINTS.CATEGORIES, formData);
}

export async function updateCategory(id, formData) {
  return submitCategoryForm('PATCH', `${API_ENDPOINTS.CATEGORIES}/${id}`, formData);
}

export async function deleteCategory(id) {
  return apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
}

export async function restoreCategory(id) {
  return apiClient.post(`${API_ENDPOINTS.CATEGORIES}/${id}/restore`);
}