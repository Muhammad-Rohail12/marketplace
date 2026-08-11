const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const errorCodes = require('../../constants/errorCodes');

// ---- SKU Configuration ----

const createSkuConfig = (data) => prisma.sKUConfiguration.create({ data });

const updateSkuConfig = async (id, data) => {
  const existing = await prisma.sKUConfiguration.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('SKU configuration not found', errorCodes.CONFIG_NOT_FOUND);
  return prisma.sKUConfiguration.update({ where: { id }, data });
};

const deleteSkuConfig = async (id) => {
  const existing = await prisma.sKUConfiguration.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('SKU configuration not found', errorCodes.CONFIG_NOT_FOUND);
  await prisma.sKUConfiguration.delete({ where: { id } });
};

const listSkuConfigs = () => prisma.sKUConfiguration.findMany({ orderBy: { createdAt: 'desc' } });

// ---- Barcode Configuration ----

const createBarcodeConfig = (data) => prisma.barcodeConfiguration.create({ data });

const updateBarcodeConfig = async (id, data) => {
  const existing = await prisma.barcodeConfiguration.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Barcode configuration not found', errorCodes.CONFIG_NOT_FOUND);
  return prisma.barcodeConfiguration.update({ where: { id }, data });
};

const deleteBarcodeConfig = async (id) => {
  const existing = await prisma.barcodeConfiguration.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Barcode configuration not found', errorCodes.CONFIG_NOT_FOUND);
  await prisma.barcodeConfiguration.delete({ where: { id } });
};

const listBarcodeConfigs = () => prisma.barcodeConfiguration.findMany({ orderBy: { createdAt: 'desc' } });

module.exports = {
  createSkuConfig, updateSkuConfig, deleteSkuConfig, listSkuConfigs,
  createBarcodeConfig, updateBarcodeConfig, deleteBarcodeConfig, listBarcodeConfigs,
};