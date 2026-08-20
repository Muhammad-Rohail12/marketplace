const prisma = require('../../database/prismaClient');

const sellerOverview = async (userId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) return { products: 0, orders: 0, revenue: 0, unitsSold: 0, averageOrderValue: 0, lowStock: 0, outOfStock: 0, topProducts: [] };
  const [products, orders, inventory, items] = await Promise.all([
    prisma.product.count({ where: { sellerId: seller.id, deletedAt: null } }),
    prisma.order.findMany({ where: { sellerId: seller.id }, select: { id: true, grandTotal: true, status: true } }),
    prisma.inventory.groupBy({ by: ['status'], where: { sellerId: seller.id }, _count: { _all: true } }),
    prisma.orderItem.findMany({ where: { order: { sellerId: seller.id } }, select: { productId: true, productName: true, quantity: true, lineSubtotal: true } }),
  ]);
  const completed = orders.filter((order) => !['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.status));
  const revenue = completed.reduce((sum, order) => sum + Number(order.grandTotal), 0);
  const unitsSold = items.reduce((sum, item) => sum + item.quantity, 0);
  const grouped = new Map();
  for (const item of items) grouped.set(item.productId, { productId: item.productId, productName: item.productName, unitsSold: (grouped.get(item.productId)?.unitsSold || 0) + item.quantity, revenue: (grouped.get(item.productId)?.revenue || 0) + Number(item.lineSubtotal) });
  const stockCount = (status) => inventory.find((item) => item.status === status)?._count._all || 0;
  return { products, orders: orders.length, revenue, unitsSold, averageOrderValue: completed.length ? revenue / completed.length : 0, lowStock: stockCount('LOW_STOCK'), outOfStock: stockCount('OUT_OF_STOCK'), topProducts: [...grouped.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10) };
};

module.exports = { sellerOverview };
