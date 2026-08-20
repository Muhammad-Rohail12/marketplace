'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AvailabilityBadge from './AvailabilityBadge';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';
import StockUrgencyBadge from './StockUrgencyBadge';
import { inventoryService } from '@/services/inventoryService';
import { pricingService } from '@/services/pricingService';

export default function ProductPurchaseCard({ product, selectedVariantId = null }) {
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [pricing, setPricing] = useState(null);

  const isVariable = product.productType === 'VARIABLE';
  const effectiveVariantId = selectedVariantId || (isVariable ? null : null);

  useEffect(() => {
    const availabilityCall = effectiveVariantId
      ? inventoryService.getVariantAvailability(effectiveVariantId)
      : inventoryService.getProductAvailability(product.id);
    availabilityCall.then((res) => setAvailability(res.data.availability)).catch(() => setAvailability(null));

    const pricingCall = effectiveVariantId
      ? pricingService.getVariantPricing(effectiveVariantId)
      : pricingService.getProductPricing(product.id);
    pricingCall.then((res) => setPricing(res.data.pricing)).catch(() => setPricing({ hasPrice: false }));
  }, [product.id, effectiveVariantId]);

  const isOutOfStock = availability?.status === 'OUT_OF_STOCK' || availability?.status === 'DISCONTINUED';
  const requiresVariant = isVariable && !effectiveVariantId;

  return (
    <div id="purchase-card-sentinel">
      <Card className="flex flex-col gap-4">
        <div>
          <PriceDisplay pricing={pricing} size="lg" />
          <p className="mt-1 text-xs text-neutral-500">Delivery availability coming soon</p>
        </div>

        {availability && (
          <div className="flex flex-col gap-1">
            <AvailabilityBadge availability={availability} />
            <StockUrgencyBadge availability={availability} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="qty" className="text-sm">Qty</label>
          <input
            id="qty"
            type="number"
            min={1}
            value={quantity}
            disabled={isOutOfStock}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent"
          />
        </div>

        {requiresVariant && <p className="text-xs text-warning-600">Please select an option above before adding to cart.</p>}

        <AddToCartButton
          productId={product.id}
          variantId={effectiveVariantId}
          quantity={quantity}
          requiresVariant={isVariable}
          disabled={isOutOfStock}
        />

        <Button type="button" variant="outline" disabled title="Coming soon">
          Buy Now
        </Button>
      </Card>
    </div>
  );
}