const prisma = require('../../database/prismaClient');
const { helpers } = require('../../marketplace');

// Reuses the Phase 16 marketplace slug generator instead of
// duplicating normalization logic — this is exactly the kind of
// reuse that module was built for.
const generateUniqueSlug = async (name, excludeId = null) => {
  const base = helpers.slug.generateSlug(name);
  let slug = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

module.exports = { generateUniqueSlug };