import MainLayout from '@/components/layout/MainLayout';
import BrandLogo from '@/components/brand/BrandLogo';
import BrandBadge from '@/components/brand/BrandBadge';
import { getCategoryBySlug as _unused } from '@/services/categoryService';
import { getBrandBySlug } from '@/services/brandService';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { notFound } from 'next/navigation';

// Foundation brand landing page — shows brand identity only; product
// listings under this brand arrive once Products exist.
export default async function BrandLandingPage({ params }) {
  let brand;
  try {
    const res = await getBrandBySlug(params.slug);
    brand = res.data.brand;
  } catch {
    notFound();
  }

  return (
    <MainLayout>
      {brand.banner && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveImageSrc(brand.banner)} alt="" className="h-48 w-full object-cover" />
      )}
      <div className="container-page flex flex-col gap-4 py-8">
        <div className="flex items-center gap-4">
          <BrandLogo brand={brand} size={72} />
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              {brand.name}
              <BrandBadge brand={brand} />
            </h1>
            {brand.country && <p className="text-sm text-gray-500">{brand.country}</p>}
          </div>
        </div>
        {brand.description && <p className="max-w-2xl text-gray-600 dark:text-gray-400">{brand.description}</p>}
        {brand.websiteUrl && (
          <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
            Visit website ↗
          </a>
        )}
      </div>
    </MainLayout>
  );
}