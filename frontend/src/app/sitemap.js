import { listCategories } from '@/services/categoryService';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const staticRoutes = ['', '/deals', '/search', '/contact', '/about', '/track-order', '/sell', '/services'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  let categoryRoutes = [];
  try {
    const res = await listCategories({ limit: 200 });
    categoryRoutes = res.data.categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
    }));
  } catch {
    categoryRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes];
}