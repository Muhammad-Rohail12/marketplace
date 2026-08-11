'use client';

import { useState } from 'react';
import ShippingOptionCard from './ShippingOptionCard';
import { cartShippingSelect } from '@/services/shippingService';

export default function ShippingMethodSelector({ storeId, shipping, currency, onChanged }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (shippingMethodId) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await cartShippingSelect(storeId, shippingMethodId);
      onChanged(res.data);
    } catch (err) {
      setError(err.message || 'Could not select shipping method');
    } finally {
      setIsSaving(false);
    }
  };

  if (shipping.error) {
    return <p role="alert" className="text-sm text-danger-600">⚠ {shipping.error}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase text-gray-500">Shipping</h3>
      {shipping.options.map((opt) => (
        <ShippingOptionCard
          key={opt.shippingMethodId}
          option={opt}
          isSelected={shipping.selected?.shippingMethodId === opt.shippingMethodId}
          onSelect={handleSelect}
          currency={currency}
        />
      ))}
      {isSaving && <p className="text-xs text-gray-500">Updating...</p>}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}