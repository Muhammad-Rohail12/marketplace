import { formatMoney } from '@/utils/currencyFormat';

export default function ShippingOptionCard({ option, isSelected, onSelect, currency }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm ${isSelected ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-gray-800'}`}>
      <div className="flex items-center gap-3">
        <input type="radio" checked={isSelected} onChange={() => onSelect(option.shippingMethodId)} className="text-primary-600" aria-label={option.name} />
        <div>
          <p className="font-medium">{option.name}</p>
          <p className="text-xs text-gray-500">{option.minDays}–{option.maxDays} business days</p>
        </div>
      </div>
      <span className="font-semibold">{option.isFree ? 'FREE' : formatMoney(option.price, currency)}</span>
    </label>
  );
}