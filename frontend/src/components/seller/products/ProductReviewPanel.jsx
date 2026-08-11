import ProductStatusBadge from '@/components/product/ProductStatusBadge';

export default function ProductReviewPanel({ product }) {
  if (!product) return null;
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{product.name || 'Untitled product'}</span>
        <ProductStatusBadge status={product.status} />
      </div>
      <p className="text-gray-500">Category: {product.category?.name || '—'}</p>
      <p className="text-gray-500">Brand: {product.brand?.name || 'Unbranded'}</p>
      <p className="text-gray-500">Type: {product.productType}</p>
      <p className="text-gray-500">Attributes set: {product.attributeValues?.length || 0}</p>
      <p className="text-gray-500">Specifications: {product.specifications?.length || 0}</p>
      <p className="text-gray-500">Variants: {product.variants?.length || 0}</p>
      {product.status === 'REJECTED' && product.rejectionReason && (
        <p className="rounded-md bg-danger-500/10 p-2 text-danger-600">Reason: {product.rejectionReason}</p>
      )}
    </div>
  );
}