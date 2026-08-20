'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FiMapPin } from 'react-icons/fi';

// No public per-product/per-ZIP delivery-date endpoint exists yet —
// Phase 28's real shipping-zone/day calculation only runs once items
// are in a cart with a selected address (see cartShipping.service.js
// and getShippingOptionsForSeller). A standalone product-page ZIP
// check against real seller rates would require a new public
// endpoint, which is backend work outside this UI-only phase's
// scope. This component is honest about that: it validates the ZIP
// format and shows a generic, clearly-labeled estimate window rather
// than a fabricated precise delivery date.
export default function DeliveryEstimateChecker() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      setError('Enter a valid US ZIP code');
      setResult(null);
      return;
    }
    setResult('Standard delivery typically takes 3–7 business days to this ZIP code.');
  };

  return (
    <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium"><FiMapPin size={14} /> Check delivery estimate</p>
      <form onSubmit={handleCheck} className="flex gap-2">
        <Input id="delivery-zip" placeholder="Enter ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} className="flex-1" />
        <Button type="submit" size="sm">Check</Button>
      </form>
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      {result && <p className="mt-2 text-xs text-neutral-500">{result} Exact rates and speeds are shown at checkout for your selected address.</p>}
    </div>
  );
}