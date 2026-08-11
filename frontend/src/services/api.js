import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export async function fetchTestConnection() {
  return apiClient.get(API_ENDPOINTS.TEST);
}