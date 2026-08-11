import { apiClient } from '@/lib/apiClient';

export async function callBuyerOnly() {
  return apiClient.get('/demo/buyer-only');
}

export async function callSellerOnly() {
  return apiClient.get('/demo/seller-only');
}

export async function callAdminOnly() {
  return apiClient.get('/demo/admin-only');
}

export async function callManageProducts() {
  return apiClient.get('/demo/manage-products');
}