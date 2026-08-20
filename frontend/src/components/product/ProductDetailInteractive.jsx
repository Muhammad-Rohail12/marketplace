'use client';

import { useState } from 'react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfoHeader from './ProductInfoHeader';
import VariantSelector from './VariantSelector';
import ProductFeatureList from './ProductFeatureList';
import ProductPurchaseCard from './ProductPurchaseCard';
import ShareProductButtons from './ShareProductButtons';
import DeliveryEstimateChecker from './DeliveryEstimateChecker';
import SizeGuideModal from './SizeGuideModal';
import StickyPurchaseBar from './StickyPurchaseBar';
import { useModal } from '@/hooks/useModal';

const hasSizeAttribute = (variants = []) =>
  variants.some((v) => v.options.some((opt) => opt.variantOption.attribute.type === 'SIZE'));

export default function ProductDetailInteractive({ product, media }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const sizeGuide = useModal(false);

  const isVariable = product.productType === 'VARIABLE';
  const showSizeGuide = hasSizeAttribute(product.variants);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_320px]">
        <ProductGallery media={media} selectedVariantId={selectedVariant?.id} />

        <div className="flex flex-col gap-4">
          <ProductInfoHeader product={product} />

          {product.attributeValues?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.attributeValues.map((av, i) => (
                <span key={i} className="rounded-full bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800">
                  {av.attribute.name}: {av.attributeValue?.label || av.value}
                </span>
              ))}
            </div>
          )}

          {product.variants?.length > 0 && (
            <div>
              <VariantSelector variants={product.variants} onVariantResolved={setSelectedVariant} />
              {showSizeGuide && (
                <button type="button" onClick={sizeGuide.open} className="mt-1 text-xs font-medium text-primary-600 hover:underline">
                  Size Guide
                </button>
              )}
            </div>
          )}

          {product.description && (
            <div>
              <h2 className="mb-1 text-sm font-semibold uppercase text-neutral-500">Description</h2>
              <p className="whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">{product.description}</p>
            </div>
          )}

          <ProductFeatureList specifications={product.specifications} />

          <DeliveryEstimateChecker />

          <ShareProductButtons productName={product.name} />
        </div>

        <ProductPurchaseCard product={product} selectedVariantId={selectedVariant?.id} />
      </div>

      <StickyPurchaseBar
        product={product}
        media={media}
        pricing={selectedVariant ? undefined : undefined}
        selectedVariantId={selectedVariant?.id}
        isOutOfStock={false}
        requiresVariant={isVariable && !selectedVariant}
      />

      <SizeGuideModal isOpen={sizeGuide.isOpen} onClose={sizeGuide.close} />
    </>
  );
}