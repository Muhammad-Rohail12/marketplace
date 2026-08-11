import { formatMoney } from '@/utils/currencyFormat';

export default function CheckoutSummaryReview({ session }) {
  const s = session.snapshot;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <h2 className="text-sm font-semibold uppercase text-gray-500">Order Review</h2>
      {s.sellerGroups.map((g) => (
        <div key={g.store.id} className="text-sm">
          <p className="font-medium">{g.store.name}</p>
          {g.items.map((i) => (
            <p key={i.id} className="text-gray-500">{i.quantity} × {i.product.name} — {formatMoney(i.lineSubtotal, s.summary.currency)}</p>
          ))}
          <p className="text-gray-500">Shipping: {formatMoney(g.shipping.selected.price, s.summary.currency)}</p>
        </div>
      ))}
      <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatMoney(s.summary.cartSubtotal, s.summary.currency)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatMoney(s.summary.shippingTotal, s.summary.currency)}</span></div>
        <div className="flex justify-between text-sm"><span>Sales Tax ({(s.taxRate * 100).toFixed(2)}%)</span><span>{formatMoney(s.taxTotal, s.summary.currency)}</span></div>
        <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatMoney(s.grandTotal, s.summary.currency)}</span></div>
      </div>
    </div>
  );
}