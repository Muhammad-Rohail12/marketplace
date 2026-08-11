'use client';

import Modal from '@/components/ui/Modal';
import AddressList from './AddressList';

// Reusable selector for cart / future checkout — wraps AddressList in
// selectable mode inside a modal, per spec's "select address
// modal/drawer" requirement.
export default function AddressSelectorModal({ isOpen, onClose, onSelect }) {
  const handleSelect = (address) => {
    onSelect(address);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a delivery address" className="max-w-2xl">
      <div className="max-h-[70vh] overflow-y-auto">
        <AddressList selectable onSelect={handleSelect} />
      </div>
    </Modal>
  );
}