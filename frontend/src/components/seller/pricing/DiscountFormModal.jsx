'use client';

import { useCallback, useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { pricingService } from '@/services/pricingService';

const TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED_AMOUNT', label: 'Fixed amount off' },
];

function toInputDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 16);
}

export default function DiscountFormModal({ isOpen, onClose, priceItem, onSaved }) {
  const [discounts, setDiscounts] = useState([]);
  const [values, setValues] = useState({ type: 'PERCENTAGE', value: '', startAt: '', endAt: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    if (!priceItem) return;
    const res = await pricingService.listDiscounts(priceItem.id);
    setDiscounts(res.data.discounts);
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (isOpen) load(); }, [isOpen, load, priceItem]);

  if (!priceItem) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!values.value || Number(values.value) <= 0) {
      setError('Enter a valid discount value');
      return;
    }
    setIsSubmitting(true);
    try {
      await pricingService.createDiscount(priceItem.id, {
        type: values.type,
        value: Number(values.value),
        startAt: values.startAt || null,
        endAt: values.endAt || null,
      });
      setValues({ type: 'PERCENTAGE', value: '', startAt: '', endAt: '' });
      load();
      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to create discount');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (discount) => {
    await pricingService.updateDiscount(discount.id, { isEnabled: !discount.isEnabled });
    load();
    onSaved();
  };

  const handleDelete = async (discount) => {
    if (!window.confirm('Remove this discount?')) return;
    await pricingService.deleteDiscount(discount.id);
    load();
    onSaved();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Discounts — ${priceItem.product?.name || ''}`} className="max-w-lg">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleCreate} className="flex flex-col gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={values.type} onChange={(e) => setValues({ ...values, type: e.target.value })} options={TYPE_OPTIONS} />
            <Input
              id="discount-value"
              label={values.type === 'PERCENTAGE' ? 'Percentage (0-100)' : 'Amount off'}
              type="number"
              step="0.01"
              value={values.value}
              onChange={(e) => setValues({ ...values, value: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="discount-start" label="Start (optional)" type="datetime-local" value={values.startAt} onChange={(e) => setValues({ ...values, startAt: e.target.value })} />
            <Input id="discount-end" label="End (optional)" type="datetime-local" value={values.endAt} onChange={(e) => setValues({ ...values, endAt: e.target.value })} />
          </div>
          {error && <p className="text-sm text-danger-600">{error}</p>}
          <Button type="submit" size="sm" isLoading={isSubmitting} className="self-start">Create Discount</Button>
        </form>

        <div className="flex flex-col gap-2">
          {discounts.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-md border border-gray-200 p-2 text-sm dark:border-gray-800">
              <div>
                <span className="font-medium">{d.type === 'PERCENTAGE' ? `${d.value}% off` : `${d.value} off`}</span>
                {d.startAt && <span className="ml-2 text-xs text-gray-500">{toInputDateTime(d.startAt)} → {d.endAt ? toInputDateTime(d.endAt) : 'no end'}</span>}
                {d.isEnabled ? <Badge variant="success" className="ml-2">Enabled</Badge> : <Badge variant="neutral" className="ml-2">Disabled</Badge>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleToggle(d)}>{d.isEnabled ? 'Disable' : 'Enable'}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(d)}>Delete</Button>
              </div>
            </div>
          ))}
          {discounts.length === 0 && <p className="text-sm text-gray-500">No discounts yet.</p>}
        </div>
      </div>
    </Modal>
  );
}