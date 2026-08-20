const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');

const serialize = (review) => ({
  ...review,
  images: review.images ? JSON.parse(review.images) : [],
  reviewerName: `${review.user.firstName} ${review.user.lastName.slice(0, 1)}.`,
  variant: review.variant?.name || null,
});

const listProductReviews = async (productId) => {
  const reviews = await prisma.review.findMany({
    where: { productId, status: 'PUBLISHED' },
    include: { user: { select: { firstName: true, lastName: true } }, variant: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const stats = { total: reviews.length, average: reviews.length ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0, distribution: {} };
  for (let star = 1; star <= 5; star += 1) stats.distribution[star] = reviews.filter((item) => item.rating === star).length;
  return { reviews: reviews.map(serialize), stats };
};

const createReview = async (userId, productId, data) => {
  const product = await prisma.product.findFirst({ where: { id: productId, status: { in: ['ACTIVE', 'OUT_OF_STOCK'] } } });
  if (!product) throw new NotFoundError('Product not found');
  const orderItem = await prisma.orderItem.findFirst({ where: { productId, order: { userId, status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } }, include: { order: true } });
  const review = await prisma.review.create({ data: { productId, userId, orderId: orderItem?.orderId || null, variantId: data.variantId || orderItem?.variantId || null, rating: Number(data.rating), title: data.title || null, body: data.body, isVerifiedPurchase: Boolean(orderItem), images: data.images ? JSON.stringify(data.images) : null, status: 'PUBLISHED' }, include: { user: { select: { firstName: true, lastName: true } }, variant: { select: { name: true } } } });
  return serialize(review);
};

const markHelpful = async (id) => prisma.review.update({ where: { id }, data: { helpfulCount: { increment: 1 } } });

module.exports = { listProductReviews, createReview, markHelpful };
