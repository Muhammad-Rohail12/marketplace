'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { inventoryService } from '@/services/inventoryService';

const MODE_OPTIONS = [
  { value: 'restock', label: 'Restock (add stock)' },
  { value: 'adjust', label: 'Manual Adjustment (+/-)' },
];

const ADJUSTMENT_TYPES = [
  { value: 'MANUAL_ADJUSTMENT', label: 'Manual Adjustment' },
  { value: 'DAMAGE', label: 'Damaged Items' },
  { value: 'LOSS', label: 'Loss' },
  { value: 'CORRECTION', label: 'Physical Count Correction' },
];

export default function AdjustStockModal({ isOpen, onClose, inventoryItem, onSaved }) {
  const [mode, setMode] = useState('restock');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('MANUAL_ADJUSTMENT');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!inventoryItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty === 0) {
      setError('Enter a valid non-zero quantity');
      return;
    }
    if (mode === 'restock' && qty <= 0) {
      setError('Restock quantity must be positive');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'restock') {
        await inventoryService.restock(inventoryItem.id, { quantity: qty, reason: reason || 'Restock' });
      } else {
        await inventoryService.adjust(inventoryItem.id, { quantity: qty, type, reason });
      }
      onSaved();
      onClose();
      setQuantity('');
      setReason('');
    } catch (err) {
      setError(err.message || 'Adjustment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Stock — ${inventoryItem.product?.name || ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Current: {inventoryItem.quantity} · Reserved: {inventoryItem.reservedQuantity} · Available: {inventoryItem.availableQuantity}
        </p>

        <Select label="Action" value={mode} onChange={(e) => setMode(e.target.value)} options={MODE_OPTIONS} />

        {mode === 'adjust' && (
          <Select label="Reason type" value={type} onChange={(e) => setType(e.target.value)} options={ADJUSTMENT_TYPES} />
        )}

        <Input
          id="adjust-qty"
          label={mode === 'restock' ? 'Quantity to add' : 'Quantity change (+ or -)'}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={mode === 'restock' ? 'e.g. 50' : 'e.g. -5 or 10'}
        />

        <Textarea id="adjust-reason" label="Reason / note" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Apply</Button>
        </div>
      </form>
    </Modal>
  );
}