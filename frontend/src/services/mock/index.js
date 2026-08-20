export * from './mockProducts';
export * from './mockCategories';
// Example pattern for future phases:
// import { USE_MOCK_DATA } from '@/config/dataSource.config';
// import { getMockProducts } from '@/services/mock';
// export async function listProducts(params) {
//   if (USE_MOCK_DATA) return getMockProducts();
//   return apiClient.get(`/products${buildQueryString(params)}`);
// }