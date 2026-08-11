'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { inventoryService } from '@/services/inventoryService';

export default function AdminAdjustModal({ isOpen, onClose, inventoryItem, onSaved }) {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!inventoryItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!reason.trim()) {
      setError('A reason is required for admin adjustments');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty === 0) {
      setError('Enter a valid non-zero quantity');
      return;
    }
    setIsSubmitting(true);
    try {
      await inventoryService.adminAdjust(inventoryItem.id, { quantity: qty, reason });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Adjustment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Admin Adjustment — ${inventoryItem.product?.name || ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">Current: {inventoryItem.quantity} · Available: {inventoryItem.availableQuantity}</p>
        <Input id="admin-qty" label="Quantity change (+ or -)" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <Textarea id="admin-reason" label="Reason (required)" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Apply</Button>
        </div>
      </form>
    </Modal>
  );
}