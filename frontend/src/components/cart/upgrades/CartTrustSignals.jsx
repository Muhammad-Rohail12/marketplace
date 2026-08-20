import { FiShield, FiRefreshCw, FiTruck } from 'react-icons/fi';

export default function CartTrustSignals() {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-3 text-xs text-neutral-500 dark:border-neutral-800">
      <div className="flex items-center gap-2"><FiShield size={14} className="text-success-600" /> Secure checkout</div>
      <div className="flex items-center gap-2"><FiTruck size={14} className="text-success-600" /> Fast US shipping</div>
      <div className="flex items-center gap-2"><FiRefreshCw size={14} className="text-success-600" /> 30-day returns</div>
    </div>
  );
}