import Button from '@/components/ui/Button';
import { formatMoney } from '@/utils/currencyFormat';
import PromoCodeInput from './upgrades/PromoCodeInput';
import CartTrustSignals from './upgrades/CartTrustSignals';

export default function CartSummary({ summary }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 shadow-xs dark:border-neutral-800">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Order Summary</h2>

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
        <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold dark:border-neutral-800">
          <span>Estimated Total (before tax)</span>
          <span>{formatMoney(summary.estimatedTotal, summary.currency)}</span>
        </div>
        <p className="text-xs text-neutral-400">Sales tax calculated at checkout.</p>
      </div>

      <PromoCodeInput />

      <Button
        type="button"
        disabled={!summary.shippingComplete}
        title={summary.shippingComplete ? 'Proceed to checkout' : 'Select a shipping method for every seller first'}
      >
        Proceed to Checkout
      </Button>

      <CartTrustSignals />
    </div>
  );
}