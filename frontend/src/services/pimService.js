import { apiClient } from '@/lib/apiClient';
import { buildQueryString } from '@/utils/queryString';

const BASE = '/pim';

export const pimService = {
  // Attribute Groups
  listAttributeGroups: (params = {}) => apiClient.get(`${BASE}/attribute-groups${buildQueryString(params)}`),
  createAttributeGroup: (data) => apiClient.post(`${BASE}/attribute-groups`, data),
  updateAttributeGroup: (id, data) => apiClient.patch(`${BASE}/attribute-groups/${id}`, data),
  deleteAttributeGroup: (id) => apiClient.delete(`${BASE}/attribute-groups/${id}`),

  // Attributes
  listAttributes: (params = {}) => apiClient.get(`${BASE}/attributes${buildQueryString(params)}`),
  getAttribute: (id) => apiClient.get(`${BASE}/attributes/${id}`),
  createAttribute: (data) => apiClient.post(`${BASE}/attributes`, data),
  updateAttribute: (id, data) => apiClient.patch(`${BASE}/attributes/${id}`, data),
  deleteAttribute: (id) => apiClient.delete(`${BASE}/attributes/${id}`),

  // Attribute Values
  listAttributeValues: (attributeId) => apiClient.get(`${BASE}/attributes/${attributeId}/values`),
  createAttributeValue: (attributeId, data) => apiClient.post(`${BASE}/attributes/${attributeId}/values`, data),
  updateAttributeValue: (id, data) => apiClient.patch(`${BASE}/attribute-values/${id}`, data),
  deleteAttributeValue: (id) => apiClient.delete(`${BASE}/attribute-values/${id}`),

  // Category Attributes
  listCategoryAttributes: (categoryId) => apiClient.get(`${BASE}/categories/${categoryId}/attributes`),
  assignCategoryAttribute: (data) => apiClient.post(`${BASE}/category-attributes`, data),
  removeCategoryAttribute: (id) => apiClient.delete(`${BASE}/category-attributes/${id}`),

  // Measurement Units
  listMeasurementUnits: (params = {}) => apiClient.get(`${BASE}/measurement-units${buildQueryString(params)}`),
  createMeasurementUnit: (data) => apiClient.post(`${BASE}/measurement-units`, data),
  updateMeasurementUnit: (id, data) => apiClient.patch(`${BASE}/measurement-units/${id}`, data),
  deleteMeasurementUnit: (id) => apiClient.delete(`${BASE}/measurement-units/${id}`),

  // Variant Options
  listVariantOptions: (params = {}) => apiClient.get(`${BASE}/variant-options${buildQueryString(params)}`),
  createVariantOption: (data) => apiClient.post(`${BASE}/variant-options`, data),
  deleteVariantOption: (id) => apiClient.delete(`${BASE}/variant-options/${id}`),

  // Variant Combinations
  listVariantCombinations: (params = {}) => apiClient.get(`${BASE}/variant-combinations${buildQueryString(params)}`),
  createVariantCombination: (data) => apiClient.post(`${BASE}/variant-combinations`, data),
  updateVariantCombination: (id, data) => apiClient.patch(`${BASE}/variant-combinations/${id}`, data),
  deleteVariantCombination: (id) => apiClient.delete(`${BASE}/variant-combinations/${id}`),

  // Specification Templates
  listSpecTemplates: (params = {}) => apiClient.get(`${BASE}/specification-templates${buildQueryString(params)}`),
  getSpecTemplate: (id) => apiClient.get(`${BASE}/specification-templates/${id}`),
  createSpecTemplate: (data) => apiClient.post(`${BASE}/specification-templates`, data),
  updateSpecTemplate: (id, data) => apiClient.patch(`${BASE}/specification-templates/${id}`, data),
  deleteSpecTemplate: (id) => apiClient.delete(`${BASE}/specification-templates/${id}`),
  addSpecTemplateItem: (templateId, data) => apiClient.post(`${BASE}/specification-templates/${templateId}/items`, data),
  removeSpecTemplateItem: (itemId) => apiClient.delete(`${BASE}/specification-template-items/${itemId}`),

  // SKU / Barcode Config
  listSkuConfigs: () => apiClient.get(`${BASE}/sku-configurations`),
  createSkuConfig: (data) => apiClient.post(`${BASE}/sku-configurations`, data),
  updateSkuConfig: (id, data) => apiClient.patch(`${BASE}/sku-configurations/${id}`, data),
  deleteSkuConfig: (id) => apiClient.delete(`${BASE}/sku-configurations/${id}`),

  listBarcodeConfigs: () => apiClient.get(`${BASE}/barcode-configurations`),
  createBarcodeConfig: (data) => apiClient.post(`${BASE}/barcode-configurations`, data),
  updateBarcodeConfig: (id, data) => apiClient.patch(`${BASE}/barcode-configurations/${id}`, data),
  deleteBarcodeConfig: (id) => apiClient.delete(`${BASE}/barcode-configurations/${id}`),
};