import { formatMoney } from '@/utils/currencyFormat';

export default function CheckoutOrderTotals({ session }) {
  const s = session.snapshot;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold uppercase text-neutral-500">Order Total</h2>
      <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatMoney(s.summary.itemsSubtotal, s.summary.currency)}</span></div>
      {s.summary.totalDiscount > 0 && (
        <div className="flex justify-between text-sm text-success-600"><span>Discount</span><span>-{formatMoney(s.summary.totalDiscount, s.summary.currency)}</span></div>
      )}
      <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatMoney(s.summary.shippingTotal, s.summary.currency)}</span></div>
      <div className="flex justify-between text-sm"><span>Sales Tax ({(s.taxRate * 100).toFixed(2)}%)</span><span>{formatMoney(s.taxTotal, s.summary.currency)}</span></div>
      <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold dark:border-neutral-800">
        <span>Total</span><span>{formatMoney(s.grandTotal, s.summary.currency)}</span>
      </div>
    </div>
  );
}