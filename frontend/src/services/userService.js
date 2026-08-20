import { apiClient } from '@/lib/apiClient';
import { apiConfig } from '@/config/api.config';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { buildQueryString } from '@/utils/queryString';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';

export async function getMyProfile() {
  return apiClient.get(API_ENDPOINTS.USER_PROFILE);
}

export async function listUsers(params = {}) {
  return apiClient.get(`${API_ENDPOINTS.USERS}${buildQueryString(params)}`);
}

export async function updateMyProfile(data) {
  return apiClient.patch(API_ENDPOINTS.USER_PROFILE, data);
}

// Multipart upload bypasses apiClient's JSON-only request() helper —
// built directly with fetch since it needs FormData, not JSON.stringify.
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = tokenStorage.getAccessToken();

  const response = await fetch(`${apiConfig.baseUrl}${API_ENDPOINTS.USER_PROFILE_IMAGE}`, {
    method: 'POST',
    headers: token ? { [AUTH_HEADER_NAME]: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const err = new Error(data.message || 'Upload failed');
    err.statusCode = response.status;
    err.errorCode = data.errorCode;
    err.errors = data.errors || [];
    throw err;
  }

  return data;
}

export async function removeProfileImage() {
  return apiClient.delete(API_ENDPOINTS.USER_PROFILE_IMAGE);
}

export async function changePassword(data) {
  return apiClient.post(API_ENDPOINTS.USER_CHANGE_PASSWORD, data);
}

export async function deactivateAccount(password) {
  return apiClient.post(API_ENDPOINTS.USER_DEACTIVATE, { password });
}