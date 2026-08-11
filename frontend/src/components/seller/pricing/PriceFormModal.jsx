'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { pricingService } from '@/services/pricingService';

const CURRENCIES = ['USD', 'PKR', 'EUR', 'SAR', 'AED'].map((c) => ({ value: c, label: c }));

export default function PriceFormModal({ isOpen, onClose, priceItem, onSaved }) {
  const isEdit = !!priceItem;
  const [values, setValues] = useState({
    currency: priceItem?.currency || 'USD',
    basePrice: priceItem?.basePrice || '',
    compareAtPrice: priceItem?.compareAtPrice || '',
    costPrice: priceItem?.costPrice || '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const payload = {
        currency: values.currency,
        basePrice: Number(values.basePrice),
        compareAtPrice: values.compareAtPrice === '' ? null : Number(values.compareAtPrice),
        costPrice: values.costPrice === '' ? null : Number(values.costPrice),
      };
      if (isEdit) {
        await pricingService.update(priceItem.id, payload);
      } else {
        await pricingService.create(priceItem.productId, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        setError(err.message || 'Failed to save price');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!priceItem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Price' : 'Set Price'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select label="Currency" name="currency" value={values.currency} onChange={handleChange} options={CURRENCIES} />
        <Input id="basePrice" name="basePrice" label="Base price" type="number" step="0.01" value={values.basePrice} onChange={handleChange} error={errors.basePrice} />
        <Input id="compareAtPrice" name="compareAtPrice" label="Compare-at price (optional — original/crossed-out price)" type="number" step="0.01" value={values.compareAtPrice} onChange={handleChange} error={errors.compareAtPrice} />
        <Input id="costPrice" name="costPrice" label="Cost price (optional — never shown to customers)" type="number" step="0.01" value={values.costPrice} onChange={handleChange} error={errors.costPrice} />

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}