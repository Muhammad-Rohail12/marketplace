const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const createUnit = async (data) => {
  const existing = await prisma.measurementUnit.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('A unit with this code already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_NAME);
  return prisma.measurementUnit.create({ data });
};

const updateUnit = async (id, data) => {
  const existing = await prisma.measurementUnit.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Measurement unit not found', errorCodes.MEASUREMENT_UNIT_NOT_FOUND);
  return prisma.measurementUnit.update({ where: { id }, data });
};

const deleteUnit = async (id) => {
  const existing = await prisma.measurementUnit.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Measurement unit not found', errorCodes.MEASUREMENT_UNIT_NOT_FOUND);
  await prisma.measurementUnit.delete({ where: { id } });
};

const listUnits = async ({ unitType } = {}) => {
  return prisma.measurementUnit.findMany({
    where: unitType ? { unitType } : {},
    orderBy: { name: 'asc' },
  });
};

module.exports = { createUnit, updateUnit, deleteUnit, listUnits };