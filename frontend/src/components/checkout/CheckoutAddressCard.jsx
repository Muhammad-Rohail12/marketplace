import { FiMapPin } from 'react-icons/fi';

export default function CheckoutAddressCard({ address, onChangeClick, isChanging }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex gap-3">
        <FiMapPin size={18} className="mt-0.5 shrink-0 text-neutral-400" />
        <div className="text-sm">
          <p className="font-medium">{address.firstName} {address.lastName}</p>
          <p className="text-neutral-500">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
          <p className="text-neutral-500">{address.city}, {address.stateCode} {address.postalCode}</p>
          <p className="text-neutral-500">{address.phone}</p>
        </div>
      </div>
      <button type="button" onClick={onChangeClick} disabled={isChanging} className="shrink-0 text-xs font-medium text-primary-600 hover:underline disabled:opacity-50">
        {isChanging ? 'Please wait...' : 'Change'}
      </button>
    </div>
  );
}