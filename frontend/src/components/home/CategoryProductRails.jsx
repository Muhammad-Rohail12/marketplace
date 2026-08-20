'use client';

import { useEffect, useState } from 'react';
import ProductRail from './ProductRail';
import { listCategories } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { HOMEPAGE_CATEGORY_SLUGS, PRODUCT_RAIL_FETCH_LIMIT } from '@/constants/homepageSections';

export default function CategoryProductRails() {
  const [rails, setRails] = useState(null);

  useEffect(() => {
    listCategories({ limit: 200 }).then(async (res) => {
      const bySlug = new Map(res.data.categories.map((c) => [c.slug, c]));
      const results = await Promise.all(
        HOMEPAGE_CATEGORY_SLUGS.map(async ({ slug, title }) => {
          const category = bySlug.get(slug);
          if (!category) return { slug, title, products: [], categorySlug: null };
          const productsRes = await productService.listByCategory(category.id, { limit: PRODUCT_RAIL_FETCH_LIMIT }).catch(() => ({ data: { products: [] } }));
          return { slug, title, products: productsRes.data.products, categorySlug: category.slug };
        })
      );
      setRails(results.filter((r) => r.products.length > 0));
    }).catch(() => setRails([]));
  }, []);

  if (rails === null) {
    return (
      <div className="flex flex-col gap-8">
        <ProductRail title="Loading..." products={[]} isLoading />
      </div>
    );
  }

  if (rails.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {rails.map((rail) => (
        <ProductRail
          key={rail.slug}
          title={rail.title}
          products={rail.products}
          viewAllHref={`/categories/${rail.categorySlug}`}
        />
      ))}
    </div>
  );
}