import Button from '@/components/ui/Button';
import { formatMoney } from '@/utils/currencyFormat';

export default function CartSummary({ summary }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <h2 className="text-sm font-semibold uppercase text-gray-500">Order Summary</h2>

      <div className="flex justify-between text-sm">
        <span>Items Subtotal</span>
        <span>{formatMoney(summary.itemsSubtotal, summary.currency)}</span>
      </div>
      {summary.totalDiscount > 0 && (
        <div className="flex justify-between text-sm text-success-600">
          <span>Discount</span>
          <span>-{formatMoney(summary.totalDiscount, summary.currency)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>{summary.shippingComplete ? formatMoney(summary.shippingTotal, summary.currency) : '—'}</span>
      </div>
      <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold dark:border-gray-800">
        <span>Estimated Total (before tax)</span>
        <span>{formatMoney(summary.estimatedTotal, summary.currency)}</span>
      </div>
      <p className="text-xs text-gray-400">Sales tax calculated at checkout.</p>

      <Button type="button" disabled={!summary.shippingComplete} title={summary.shippingComplete ? 'Coming in a future phase' : 'Select a shipping method for every seller first'} className="mt-2">
        Proceed to Checkout
      </Button>
    </div>
  );
}