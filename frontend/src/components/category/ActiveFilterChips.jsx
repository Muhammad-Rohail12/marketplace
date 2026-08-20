import { FiX } from 'react-icons/fi';
import { formatMoney } from '@/utils/currencyFormat';

export default function ActiveFilterChips({ selectedBrands, priceRange, priceBounds, onRemoveBrand, onResetPrice, onClearAll }) {
  const priceActive = priceRange && (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max);
  const hasAny = selectedBrands.length > 0 || priceActive;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedBrands.map((brand) => (
        <button
          key={brand.id}
          type="button"
          onClick={() => onRemoveBrand(brand.id)}
          className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400"
        >
          {brand.name} <FiX size={12} />
        </button>
      ))}
      {priceActive && (
        <button
          type="button"
          onClick={onResetPrice}
          className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400"
        >
          {formatMoney(priceRange[0], 'USD')} – {formatMoney(priceRange[1], 'USD')} <FiX size={12} />
        </button>
      )}
      <button type="button" onClick={onClearAll} className="text-xs font-medium text-neutral-500 underline hover:text-neutral-700">
        Clear all
      </button>
    </div>
  );
}