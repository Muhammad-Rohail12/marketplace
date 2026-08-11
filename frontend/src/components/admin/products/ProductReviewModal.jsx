'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import ProductStatusBadge from '@/components/product/ProductStatusBadge';
import { productService } from '@/services/productService';

export default function ProductReviewModal({ isOpen, onClose, product, onChanged }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const run = async (fn) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fn();
      onChanged(res.data.product);
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => run(() => productService.approve(product.id));
  const handleDeactivate = () => run(() => productService.deactivate(product.id));
  const handleArchive = () => run(() => productService.adminArchive(product.id));
  const handleReject = () => {
    if (!rejectionReason.trim()) { setError('A rejection reason is required'); return; }
    run(() => productService.reject(product.id, rejectionReason));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Review" className="max-w-2xl">
      <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <ProductStatusBadge status={product.status} />
        </div>

        <p className="text-sm text-gray-500">
          Seller: {product.seller?.user?.firstName} {product.seller?.user?.lastName} · Store: {product.store?.name}
        </p>
        <p className="text-sm text-gray-500">Category: {product.category?.name} · Brand: {product.brand?.name || 'Unbranded'}</p>
        {product.description && <p className="text-sm">{product.description}</p>}

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase text-gray-500">Attributes</h4>
          {product.attributeValues?.map((av) => (
            <p key={av.id} className="text-sm">{av.attribute.name}: {av.attributeValue?.label || av.value}</p>
          ))}
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase text-gray-500">Variants</h4>
          {product.variants?.map((v) => <p key={v.id} className="text-sm">{v.name} {v.sku && `(SKU: ${v.sku})`}</p>)}
          {(!product.variants || product.variants.length === 0) && <p className="text-sm text-gray-400">None</p>}
        </div>

        {showReject && (
          <Textarea label="Rejection reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={2} />
        )}

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          {product.status === 'PENDING_REVIEW' && !showReject && (
            <>
              <Button size="sm" onClick={handleApprove} isLoading={isSubmitting}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => setShowReject(true)}>Reject</Button>
            </>
          )}
          {showReject && (
            <>
              <Button size="sm" variant="danger" onClick={handleReject} isLoading={isSubmitting}>Confirm Rejection</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button>
            </>
          )}
          {product.status === 'ACTIVE' && <Button size="sm" variant="danger" onClick={handleDeactivate} isLoading={isSubmitting}>Deactivate</Button>}
          {['ACTIVE', 'INACTIVE', 'DRAFT'].includes(product.status) && (
            <Button size="sm" variant="ghost" onClick={handleArchive} isLoading={isSubmitting}>Archive</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}