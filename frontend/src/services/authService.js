import { apiClient, addRequestInterceptor, setUnauthorizedHandler } from '@/lib/apiClient';
import { tokenStorage } from '@/lib/tokenStorage';
import { AUTH_HEADER_NAME } from '@/constants/auth';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

addRequestInterceptor((requestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    requestConfig.headers = {
      ...requestConfig.headers,
      [AUTH_HEADER_NAME]: `Bearer ${token}`,
    };
  }
  return requestConfig;
});

export async function register({ firstName, lastName, email, password, confirmPassword }) {
  return apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });
}

export async function verifyEmail(token) {
  return apiClient.get(`${API_ENDPOINTS.AUTH_VERIFY_EMAIL}?token=${encodeURIComponent(token)}`);
}

export async function resendVerification(email) {
  return apiClient.post(API_ENDPOINTS.AUTH_RESEND_VERIFICATION, { email });
}

export async function login({ email, password }) {
  const res = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });
  tokenStorage.setAccessToken(res.data.accessToken);
  return res;
}

export async function refreshSession() {
  const res = await apiClient.post(API_ENDPOINTS.AUTH_REFRESH);
  tokenStorage.setAccessToken(res.data.accessToken);
  return res;
}

export async function getSession() {
  return apiClient.get(API_ENDPOINTS.AUTH_SESSION);
}

export async function logout() {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  } finally {
    tokenStorage.clearAccessToken();
  }
}

export async function forgotPassword(email) {
  return apiClient.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
}

export async function resetPassword({ token, password, confirmPassword }) {
  return apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, { token, password, confirmPassword });
}

setUnauthorizedHandler(async () => {
  await refreshSession();
});