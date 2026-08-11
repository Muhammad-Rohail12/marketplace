'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AddressSelectorModal from './AddressSelectorModal';
import { cartService } from '@/services/cartService';
import { useModal } from '@/hooks/useModal';

export default function CartDeliveryAddress({ address, onChanged }) {
  const selectorModal = useModal(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (selected) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await cartService.selectDeliveryAddress(selected.id);
      onChanged(res.data);
    } catch (err) {
      setError(err.message || 'Failed to select address');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase text-gray-500">Delivery Address</h2>

      {address ? (
        <div className="text-sm">
          <p className="font-medium">{address.firstName} {address.lastName}</p>
          <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
          <p>{address.city}, {address.stateCode} {address.postalCode}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No delivery address selected yet.</p>
      )}

      {error && <p className="text-xs text-danger-600">{error}</p>}

      <Button size="sm" variant="outline" onClick={selectorModal.open} isLoading={isSaving} className="self-start">
        {address ? 'Change address' : 'Select address'}
      </Button>

      <AddressSelectorModal isOpen={selectorModal.isOpen} onClose={selectorModal.close} onSelect={handleSelect} />
    </Card>
  );
}