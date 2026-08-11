'use client';

import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { addressService } from '@/services/addressService';
import { useModal } from '@/hooks/useModal';

export default function AddressList({ selectable = false, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const formModal = useModal(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await addressService.list();
      setAddresses(res.data.addresses);
    } catch (err) {
      setLoadError(err.message || 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleAdd = () => { setEditingAddress(null); formModal.open(); };
  const handleEdit = (address) => { setEditingAddress(address); formModal.open(); };

  const handleDelete = async (address) => {
    if (!window.confirm('Remove this address?')) return;
    await addressService.remove(address.id);
    load();
  };

  const handleSetDefault = async (address) => {
    await addressService.setDefault(address.id);
    load();
  };

  const handleSaved = () => {
    formModal.close();
    load();
  };

  if (isLoading) return <PageLoader label="Loading addresses..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-gray-500">Saved Addresses</h2>
        <Button size="sm" onClick={handleAdd}>+ Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState title="No saved addresses yet" message="Add an address to speed up future checkout." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              selectable={selectable}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      <Modal isOpen={formModal.isOpen} onClose={formModal.close} title={editingAddress ? 'Edit Address' : 'Add Address'} className="max-w-lg">
        <AddressForm address={editingAddress} onSaved={handleSaved} onCancel={formModal.close} />
      </Modal>
    </div>
  );
}