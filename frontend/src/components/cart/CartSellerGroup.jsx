import CartItemRow from './CartItemRow';
import ShippingMethodSelector from './shipping/ShippingMethodSelector';

export default function CartSellerGroup({ group, currency, onShippingChanged }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
        <span className="text-sm font-semibold">{group.store.name}</span>
      </div>
      <div className="flex flex-col">
        {group.items.map((item) => (
          <CartItemRow key={item.id} item={item} currency={currency} />
        ))}
      </div>
      <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <ShippingMethodSelector storeId={group.store.id} shipping={group.shipping} currency={currency} onChanged={onShippingChanged} />
      </div>
    </div>
  );
}