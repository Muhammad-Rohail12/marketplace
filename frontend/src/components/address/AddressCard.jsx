'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AddressLabelBadge from './AddressLabelBadge';

export default function AddressCard({ address, onEdit, onDelete, onSetDefault, onSelect, selectable = false }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <AddressLabelBadge label={address.label} />
        {address.isDefault && <span className="text-xs font-medium text-primary-600">Default</span>}
      </div>

      <div className="text-sm">
        <p className="font-medium">{address.firstName} {address.lastName}</p>
        {address.companyName && <p className="text-gray-500">{address.companyName}</p>}
        <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
        <p>{address.city}, {address.stateCode} {address.postalCode}</p>
        <p className="text-gray-500">{address.phone}</p>
        {address.deliveryInstructions && <p className="mt-1 text-xs text-gray-400">Note: {address.deliveryInstructions}</p>}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectable && (
          <Button size="sm" onClick={() => onSelect(address)}>Deliver here</Button>
        )}
        {onEdit && <Button size="sm" variant="ghost" onClick={() => onEdit(address)}>Edit</Button>}
        {!address.isDefault && onSetDefault && (
          <Button size="sm" variant="ghost" onClick={() => onSetDefault(address)}>Set default</Button>
        )}
        {onDelete && <Button size="sm" variant="ghost" onClick={() => onDelete(address)}>Delete</Button>}
      </div>
    </Card>
  );
}