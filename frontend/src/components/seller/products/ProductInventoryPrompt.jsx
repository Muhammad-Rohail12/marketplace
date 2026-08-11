'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { inventoryService } from '@/services/inventoryService';

// Simple inline prompt shown on a SIMPLE product's edit page when no
// inventory record exists yet — variant-level inventory creation
// happens per-variant inside the Variants tab (see ProductVariantsForm
// integration note below) since each variant needs its own record.
export default function ProductInventoryPrompt({ productId, hasInventory, onCreated }) {
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (hasInventory) return null;

  const handleCreate = async () => {
    setError('');
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Enter a valid starting quantity');
      return;
    }
    setIsSubmitting(true);
    try {
      await inventoryService.create(productId, { quantity: qty, lowStockThreshold: parseInt(threshold, 10) || 5 });
      setSuccess(true);
      onCreated();
    } catch (err) {
      setError(err.message || 'Failed to create inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) return <SuccessMessage message="Inventory created! Manage stock levels from the Inventory page." />;

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Set up inventory tracking</h3>
      <p className="text-sm text-gray-500">This product doesn&apos;t have inventory tracking yet.</p>
      <div className="grid grid-cols-2 gap-3">
        <Input id="initial-qty" label="Starting quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <Input id="low-threshold" label="Low stock threshold" type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
      </div>
      {error && <p className="text-sm text-danger-600">{error}</p>}
      <Button size="sm" onClick={handleCreate} isLoading={isSubmitting} className="self-start">Create Inventory</Button>
    </Card>
  );
}