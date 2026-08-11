import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProductGallery from '@/components/product/gallery/ProductGallery';
import ProductPurchaseCard from '@/components/product/ProductPurchaseCard';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { productService } from '@/services/productService';
import { mediaService } from '@/services/mediaService';
import { ROUTES } from '@/constants/routes';

export default async function PublicProductPage({ params }) {
  let product;
  try {
    const res = await productService.getPublic(params.slug);
    product = res.data.product;
  } catch {
    notFound();
  }

  let media = [];
  try {
    const mediaRes = await mediaService.getPublicMedia(product.id);
    media = mediaRes.data.media;
  } catch {
    media = [];
  }

  let related = [];
  try {
    const relRes = await productService.getRelated(product.id);
    related = relRes.data.products;
  } catch {
    related = [];
  }

  return (
    <MainLayout>
      <div className="container-page flex flex-col gap-6 py-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: product.category.name, href: `/categories/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_320px]">
          <ProductGallery media={media} />

          <div className="flex flex-col gap-3">
            {product.brand && <span className="text-sm text-primary-600">{product.brand.name}</span>}
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <span className="text-sm text-gray-400">★★★★★ (0 reviews — coming soon)</span>
            {product.shortDescription && <p className="text-gray-600 dark:text-gray-400">{product.shortDescription}</p>}

            {product.attributeValues?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.attributeValues.map((av, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                    {av.attribute.name}: {av.attributeValue?.label || av.value}
                  </span>
                ))}
              </div>
            )}

            {product.description && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-500">About this item</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            <ProductSpecsTable specifications={product.specifications} />
          </div>

          <ProductPurchaseCard product={product} />
        </div>

        {related.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Related Products</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </MainLayout>
  );
}