'use client';

import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLoader from '@/components/feedback/PageLoader';
import CartSellerGroup from '@/components/cart/CartSellerGroup';
import CartSummary from '@/components/cart/CartSummary';
import CartWarnings from '@/components/cart/CartWarnings';
import EmptyCart from '@/components/cart/EmptyCart';
import CartDeliveryAddress from '@/components/address/CartDeliveryAddress';
import { useCart } from '@/context/CartContext';

function CartPageContent() {
  const { cartData, isLoading, refreshCart } = useCart();

  if (isLoading) return <PageLoader label="Loading your cart..." />;

  const sellerGroups = cartData?.sellerGroups || [];
  const isEmpty = sellerGroups.length === 0;

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <CartWarnings warnings={cartData.warnings} />
            {sellerGroups.map((group) => (
              <CartSellerGroup key={group.store.id} group={group} currency={cartData.summary.currency} onShippingChanged={refreshCart} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <CartDeliveryAddress address={cartData.cart?.deliveryAddress} onChanged={refreshCart} />
            <CartSummary summary={cartData.summary} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <CartPageContent />
      </ProtectedRoute>
    </MainLayout>
  );
}