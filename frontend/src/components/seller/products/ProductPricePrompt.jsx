'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { pricingService } from '@/services/pricingService';

export default function ProductPricePrompt({ productId, hasPrice, onCreated }) {
  const [basePrice, setBasePrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (hasPrice) return null;

  const handleCreate = async () => {
    setError('');
    const price = Number(basePrice);
    if (isNaN(price) || price < 0) {
      setError('Enter a valid base price');
      return;
    }
    setIsSubmitting(true);
    try {
      await pricingService.create(productId, { basePrice: price });
      setSuccess(true);
      onCreated();
    } catch (err) {
      setError(err.message || 'Failed to set price');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) return <SuccessMessage message="Price set! Manage discounts and deals from the Pricing page." />;

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Set a price</h3>
      <p className="text-sm text-gray-500">This product doesn&apos;t have a price yet — it can&apos;t be listed as ACTIVE without one.</p>
      <Input id="initial-price" label="Base price" type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
      {error && <p className="text-sm text-danger-600">{error}</p>}
      <Button size="sm" onClick={handleCreate} isLoading={isSubmitting} className="self-start">Set Price</Button>
    </Card>
  );
}