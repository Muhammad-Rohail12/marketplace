import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import ResponsiveDataTable from '@/components/ui/ResponsiveDataTable';
import { formatMoney } from '@/utils/currencyFormat';
import { formatDate } from '@/utils/formatDate';

export default function AdminOrdersTable({ orders }) {
  const columns = [
    { key: 'orderNumber', label: 'Order #', render: (o) => o.orderNumber },
    { key: 'store', label: 'Store', render: (o) => o.store?.name },
    { key: 'customer', label: 'Customer', render: (o) => `${o.user?.firstName} ${o.user?.lastName}`, hideOnMobile: true },
    { key: 'status', label: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
    { key: 'total', label: 'Total', render: (o) => formatMoney(o.grandTotal, o.currency) },
    { key: 'date', label: 'Date', render: (o) => formatDate(o.createdAt), hideOnMobile: true },
  ];

  return <ResponsiveDataTable columns={columns} rows={orders} rowKey="id" emptyMessage="No orders found." />;
}