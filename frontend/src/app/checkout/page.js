'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import CheckoutSummaryReview from '@/components/checkout/CheckoutSummaryReview';
import Button from '@/components/ui/Button';
import { checkoutService } from '@/services/checkoutService';
import { orderService } from '@/services/orderService';

function CheckoutContent() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    checkoutService.create()
      .then((res) => setSession(res.data.session))
      .catch((err) => setError(err.message || 'Could not start checkout'))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    setError('');
    try {
      const res = await orderService.place(session.id);
      router.push(`/account/orders/${res.data.orderIds[0]}?placed=true`);
    } catch (err) {
      setError(err.message || 'Could not place order');
    } finally {
      setIsPlacing(false);
    }
  };

  if (isLoading) return <PageLoader label="Preparing checkout..." />;
  if (error) return <div className="container-page py-10"><ErrorState message={error} onRetry={() => router.push('/cart')} /></div>;
  if (!session) return null;

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <CheckoutSummaryReview session={session} />
      <Button onClick={handlePlaceOrder} isLoading={isPlacing}>Place Order</Button>
      <p className="text-xs text-gray-400">Your items are reserved until {new Date(session.expiresAt).toLocaleTimeString()}. Payment collection is coming in a future update — orders are recorded as pending payment.</p>
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