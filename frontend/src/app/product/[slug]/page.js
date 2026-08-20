import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProductDetailInteractive from '@/components/product/ProductDetailInteractive';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';
import ProductGrid from '@/components/product/ProductGrid';
import RecentlyViewedTracker from '@/components/product/RecentlyViewedTracker';
import RecentlyViewedSection from '@/components/product/RecentlyViewedSection';
import ProductReviewsSection from '@/components/reviews/ProductReviewsSection';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { productService } from '@/services/productService';
import { mediaService } from '@/services/mediaService';
import { buildMetadata } from '@/utils/seo';
import { ROUTES } from '@/constants/routes';

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const res = await productService.getPublic(slug);
    const product = res.data.product;
    return buildMetadata({
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      path: `/product/${product.slug}`,
    });
  } catch {
    return buildMetadata({ title: 'Product', noIndex: true });
  }
}

export default async function PublicProductPage({ params }) {
  let product;
  try {
    const { slug } = await params;
    const res = await productService.getPublic(slug);
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
      <div className="container-page flex flex-col gap-6 py-6 pb-24">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: product.category.name, href: `/categories/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <RecentlyViewedTracker product={product} />

        <ProductDetailInteractive product={product} media={media} />

        <ProductSpecsTable specifications={product.specifications} />

        {related.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Related Products</h2>
            <ProductGrid products={related} />
          </section>
        )}

        <RecentlyViewedSection excludeProductId={product.id} />

        <ProductReviewsSection productId={product.id} productName={product.name} />
      </div>
    </MainLayout>
  );
}