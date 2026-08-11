const prisma = require('../../database/prismaClient');
const CATEGORY = require('../constants/category.constants');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

// Builds a nested tree from a flat category list. O(n) via a
// parentId -> children[] map rather than repeated array filtering.
const buildTree = (flatCategories, parentId = null) => {
  const byParent = new Map();
  flatCategories.forEach((cat) => {
    const key = cat.parentId ?? 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(cat);
  });

  const attachChildren = (pid) => {
    const key = pid ?? 'root';
    const nodes = (byParent.get(key) || []).sort((a, b) => a.sortOrder - b.sortOrder);
    return nodes.map((node) => ({ ...node, children: attachChildren(node.id) }));
  };

  return attachChildren(parentId);
};

// Walks up the parent chain to compute the full ancestor list
// (root-first). Used for breadcrumbs and circular-reference checks.
const getAncestors = async (categoryId) => {
  const ancestors = [];
  let current = await prisma.category.findUnique({ where: { id: categoryId } });

  while (current && current.parentId) {
    // eslint-disable-next-line no-await-in-loop
    current = await prisma.category.findUnique({ where: { id: current.parentId } });
    if (current) ancestors.unshift(current);
  }

  return ancestors;
};

// Returns the flat set of every descendant category ID (all depths)
// below the given category — used to block circular reparenting and
// for cascading soft-delete visibility decisions.
const getDescendantIds = async (categoryId) => {
  const all = await prisma.category.findMany({ where: { deletedAt: null } });
  const byParent = new Map();
  all.forEach((cat) => {
    if (!byParent.has(cat.parentId)) byParent.set(cat.parentId, []);
    byParent.get(cat.parentId).push(cat);
  });

  const result = [];
  const queue = [categoryId];

  while (queue.length) {
    const currentId = queue.shift();
    const children = byParent.get(currentId) || [];
    children.forEach((child) => {
      result.push(child.id);
      queue.push(child.id);
    });
  }

  return result;
};

const computeLevel = async (parentId) => {
  if (!parentId) return 0;
  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) {
    throw new AppError('Parent category not found', httpStatus.BAD_REQUEST, errorCodes.INVALID_PARENT);
  }
  const level = parent.level + 1;
  if (level >= CATEGORY.MAX_DEPTH) {
    throw new AppError(
      `Category hierarchy cannot exceed ${CATEGORY.MAX_DEPTH} levels deep`,
      httpStatus.BAD_REQUEST,
      errorCodes.MAX_DEPTH_EXCEEDED
    );
  }
  return level;
};

// Prevents a category from being reparented under itself or any of
// its own descendants (which would create a cycle in the tree).
const assertNoCircularReference = async (categoryId, newParentId) => {
  if (!newParentId) return;
  if (newParentId === categoryId) {
    throw new AppError('A category cannot be its own parent', httpStatus.BAD_REQUEST, errorCodes.CIRCULAR_HIERARCHY);
  }
  const descendantIds = await getDescendantIds(categoryId);
  if (descendantIds.includes(newParentId)) {
    throw new AppError(
      'Cannot move a category under its own descendant',
      httpStatus.BAD_REQUEST,
      errorCodes.CIRCULAR_HIERARCHY
    );
  }
};

const getBreadcrumb = async (categoryId) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError('Category not found', httpStatus.NOT_FOUND, errorCodes.CATEGORY_NOT_FOUND);
  }
  const ancestors = await getAncestors(categoryId);
  return [...ancestors, category].map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
};

module.exports = {
  buildTree,
  getAncestors,
  getDescendantIds,
  computeLevel,
  assertNoCircularReference,
  getBreadcrumb,
};