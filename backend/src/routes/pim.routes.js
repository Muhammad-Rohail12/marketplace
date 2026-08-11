const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');

const attributeCtrl = require('../pim/controllers/attribute.controller');
const unitCtrl = require('../pim/controllers/measurementUnit.controller');
const variantCtrl = require('../pim/controllers/variant.controller');
const specCtrl = require('../pim/controllers/specification.controller');
const configCtrl = require('../pim/controllers/productConfig.controller');

const router = express.Router();
const admin = [authenticate, authorize(ROLES.ADMIN)];

// Attribute Groups
router.get('/attribute-groups', attributeCtrl.listAttributeGroups);
router.post('/attribute-groups', ...admin, attributeCtrl.createAttributeGroup);
router.patch('/attribute-groups/:id', ...admin, attributeCtrl.updateAttributeGroup);
router.delete('/attribute-groups/:id', ...admin, attributeCtrl.deleteAttributeGroup);

// Attributes
router.get('/attributes', attributeCtrl.listAttributes);
router.get('/attributes/:id', attributeCtrl.getAttribute);
router.post('/attributes', ...admin, attributeCtrl.createAttribute);
router.patch('/attributes/:id', ...admin, attributeCtrl.updateAttribute);
router.delete('/attributes/:id', ...admin, attributeCtrl.deleteAttribute);

// Attribute Values (nested under attribute)
router.get('/attributes/:attributeId/values', attributeCtrl.listAttributeValues);
router.post('/attributes/:attributeId/values', ...admin, attributeCtrl.createAttributeValue);
router.patch('/attribute-values/:id', ...admin, attributeCtrl.updateAttributeValue);
router.delete('/attribute-values/:id', ...admin, attributeCtrl.deleteAttributeValue);

// Category Attribute Assignments
router.get('/categories/:categoryId/attributes', attributeCtrl.listCategoryAttributes);
router.post('/category-attributes', ...admin, attributeCtrl.assignCategoryAttribute);
router.delete('/category-attributes/:id', ...admin, attributeCtrl.removeCategoryAttribute);

// Measurement Units
router.get('/measurement-units', unitCtrl.listUnits);
router.post('/measurement-units', ...admin, unitCtrl.createUnit);
router.patch('/measurement-units/:id', ...admin, unitCtrl.updateUnit);
router.delete('/measurement-units/:id', ...admin, unitCtrl.deleteUnit);

// Variant Options
router.get('/variant-options', variantCtrl.listVariantOptions);
router.post('/variant-options', ...admin, variantCtrl.createVariantOption);
router.delete('/variant-options/:id', ...admin, variantCtrl.deleteVariantOption);

// Variant Combinations
router.get('/variant-combinations', variantCtrl.listVariantCombinations);
router.post('/variant-combinations', ...admin, variantCtrl.createVariantCombination);
router.patch('/variant-combinations/:id', ...admin, variantCtrl.updateVariantCombination);
router.delete('/variant-combinations/:id', ...admin, variantCtrl.deleteVariantCombination);

// Specification Templates
router.get('/specification-templates', specCtrl.listTemplates);
router.get('/specification-templates/:id', specCtrl.getTemplate);
router.post('/specification-templates', ...admin, specCtrl.createTemplate);
router.patch('/specification-templates/:id', ...admin, specCtrl.updateTemplate);
router.delete('/specification-templates/:id', ...admin, specCtrl.deleteTemplate);
router.post('/specification-templates/:templateId/items', ...admin, specCtrl.addTemplateItem);
router.delete('/specification-template-items/:itemId', ...admin, specCtrl.removeTemplateItem);

// SKU / Barcode Configuration
router.get('/sku-configurations', configCtrl.listSkuConfigs);
router.post('/sku-configurations', ...admin, configCtrl.createSkuConfig);
router.patch('/sku-configurations/:id', ...admin, configCtrl.updateSkuConfig);
router.delete('/sku-configurations/:id', ...admin, configCtrl.deleteSkuConfig);

router.get('/barcode-configurations', configCtrl.listBarcodeConfigs);
router.post('/barcode-configurations', ...admin, configCtrl.createBarcodeConfig);
router.patch('/barcode-configurations/:id', ...admin, configCtrl.updateBarcodeConfig);
router.delete('/barcode-configurations/:id', ...admin, configCtrl.deleteBarcodeConfig);

module.exports = router;