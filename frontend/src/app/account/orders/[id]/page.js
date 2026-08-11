'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageLoader from '@/components/feedback/PageLoader';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { orderService } from '@/services/orderService';
import { formatMoney } from '@/utils/currencyFormat';

function OrderDetailContent() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = () => orderService.getMine(id).then((res) => setOrder(res.data.order)).finally(() => setIsLoading(false));
  useEffect(() => { load(); }, [id]);

  const handleCancel = async () => {
    const reason = window.prompt('Reason for cancellation?');
    if (!reason) return;
    setIsCancelling(true);
    try {
      await orderService.cancelMine(id, reason);
      load();
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading order..." />;
  if (!order) return null;

  const canCancel = ['PENDING_PAYMENT', 'PAID'].includes(order.status);

  return (
    <div className="container-page flex flex-col gap-6 py-10">
      <SuccessMessage message={`Order ${order.orderNumber} placed successfully!`} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card className="flex flex-col gap-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity} × {item.productName}{item.variantName ? ` (${item.variantName})` : ''}</span>
            <span>{formatMoney(item.lineSubtotal, order.currency)}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
          <div className="flex justify-between text-sm"><span>Shipping ({order.shippingMethodName})</span><span>{formatMoney(order.shippingTotal, order.currency)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax</span><span>{formatMoney(order.taxTotal, order.currency)}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatMoney(order.grandTotal, order.currency)}</span></div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">Shipping To</h2>
        <p className="text-sm">{order.shipFirstName} {order.shipLastName}</p>
        <p className="text-sm">{order.shipAddressLine1}{order.shipAddressLine2 ? `, ${order.shipAddressLine2}` : ''}</p>
        <p className="text-sm">{order.shipCity}, {order.shipStateCode} {order.shipPostalCode}</p>
      </Card>

      {canCancel && (
        <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} className="self-start">Cancel Order</Button>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <OrderDetailContent />
      </ProtectedRoute>
    </MainLayout>
  );
}