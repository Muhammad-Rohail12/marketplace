'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import Button from '@/components/ui/Button';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CheckoutSessionTimer from '@/components/checkout/CheckoutSessionTimer';
import CheckoutAddressCard from '@/components/checkout/CheckoutAddressCard';
import CheckoutSellerGroupCard from '@/components/checkout/CheckoutSellerGroupCard';
import CheckoutOrderTotals from '@/components/checkout/CheckoutOrderTotals';
import PaymentMethodSelector, { validateCardDetails } from '@/components/checkout/PaymentMethodSelector';
import { checkoutService } from '@/services/checkoutService';
import { orderService } from '@/services/orderService';

function CheckoutContent() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [step, setStep] = useState('review');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    checkoutService.create()
      .then((res) => setSession(res.data.session))
      .catch((err) => setError(err.message || 'Could not start checkout'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleExpire = () => {
    router.push('/cart?checkout=expired');
  };

  // Editing address/shipping requires cancelling the real session
  // (releases real inventory reservations, Phase 29) since no
  // partial-edit endpoint exists — this is the honest path, not a
  // fabricated inline-edit that would desync from the real backend.
  const handleChangeCart = async () => {
    if (!session) return;
    setIsCancelling(true);
    try {
      await checkoutService.cancel(session.id);
    } finally {
      router.push('/cart');
    }
  };

  const handleContinueToPayment = () => setStep('payment');

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'CARD') {
      const { isValid, errors } = validateCardDetails(cardDetails);
      if (!isValid) {
        setCardErrors(errors);
        return;
      }
    }
    setIsPlacing(true);
    setError('');
    try {
      const res = await orderService.place(session.id);
      router.push(`/account/orders/${res.data.orderIds[0]}?placed=true`);
    } catch (err) {
      setError(err.message || 'Could not place order');
      setStep('review');
    } finally {
      setIsPlacing(false);
    }
  };

  if (isLoading) return <PageLoader label="Preparing checkout..." />;
  if (error && !session) return <div className="container-page py-10"><ErrorState message={error} onRetry={() => router.push('/cart')} /></div>;
  if (!session) return null;

  const s = session.snapshot;

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <CheckoutSteps currentStep={step} />
      </div>

      <CheckoutSessionTimer expiresAt={session.expiresAt} onExpire={handleExpire} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <CheckoutAddressCard address={s.deliveryAddress} onChangeClick={handleChangeCart} isChanging={isCancelling} />

          {step === 'review' && (
            <>
              <div className="flex flex-col gap-3">
                {s.sellerGroups.map((group) => (
                  <CheckoutSellerGroupCard key={group.store.id} group={group} currency={s.summary.currency} />
                ))}
              </div>
              <Button onClick={handleContinueToPayment} className="self-start">Continue to Payment</Button>
            </>
          )}

          {step === 'payment' && (
            <>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                cardDetails={cardDetails}
                onCardDetailsChange={setCardDetails}
                errors={cardErrors}
              />
              {error && <p className="text-sm text-danger-600">{error}</p>}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep('review')}>Back</Button>
                <Button onClick={handlePlaceOrder} isLoading={isPlacing}>Place Order</Button>
              </div>
              <p className="text-xs text-neutral-400">By placing your order, you agree to our Terms of Service. No payment is charged yet — checkout will support live payment processing in a future update.</p>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <CheckoutOrderTotals session={session} />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <CheckoutContent />
      </ProtectedRoute>
    </MainLayout>
  );
}