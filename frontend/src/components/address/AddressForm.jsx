'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { US_STATES } from '@/constants/usStates';
import { addressService } from '@/services/addressService';

const LABEL_OPTIONS = [
  { value: 'HOME', label: 'Home' },
  { value: 'WORK', label: 'Work' },
  { value: 'OTHER', label: 'Other' },
];

const STATE_OPTIONS = [{ value: '', label: 'Select state...' }, ...US_STATES.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))];

export default function AddressForm({ address, onSaved, onCancel }) {
  const isEdit = !!address;
  const [values, setValues] = useState({
    label: address?.label || 'HOME',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    companyName: address?.companyName || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    stateCode: address?.stateCode || '',
    postalCode: address?.postalCode || '',
    phone: address?.phone || '',
    deliveryInstructions: address?.deliveryInstructions || '',
    isDefault: address?.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);
    try {
      const payload = { ...values, countryCode: 'US' };
      if (isEdit) {
        await addressService.update(address.id, payload);
      } else {
        await addressService.create(payload);
      }
      onSaved();
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || 'Failed to save address');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Select label="Label" name="label" value={values.label} onChange={handleChange} options={LABEL_OPTIONS} />

      <div className="grid grid-cols-2 gap-4">
        <Input id="firstName" name="firstName" label="First name" value={values.firstName} onChange={handleChange} error={errors.firstName} />
        <Input id="lastName" name="lastName" label="Last name" value={values.lastName} onChange={handleChange} error={errors.lastName} />
      </div>

      <Input id="companyName" name="companyName" label="Company (optional)" value={values.companyName} onChange={handleChange} error={errors.companyName} />

      <Input id="addressLine1" name="addressLine1" label="Address line 1" placeholder="123 Main Street" value={values.addressLine1} onChange={handleChange} error={errors.addressLine1} />
      <Input id="addressLine2" name="addressLine2" label="Apt, suite, unit (optional)" placeholder="Apt 4B" value={values.addressLine2} onChange={handleChange} error={errors.addressLine2} />

      <div className="grid grid-cols-3 gap-4">
        <Input id="city" name="city" label="City" value={values.city} onChange={handleChange} error={errors.city} className="col-span-1" />
        <Select label="State" name="stateCode" value={values.stateCode} onChange={handleChange} options={STATE_OPTIONS} error={errors.stateCode} />
        <Input id="postalCode" name="postalCode" label="ZIP code" placeholder="12345" value={values.postalCode} onChange={handleChange} error={errors.postalCode} />
      </div>

      <Input id="phone" name="phone" type="tel" label="Phone" placeholder="(555) 123-4567" value={values.phone} onChange={handleChange} error={errors.phone} />

      <Textarea
        id="deliveryInstructions"
        name="deliveryInstructions"
        label="Delivery instructions (optional)"
        placeholder="e.g. Leave at front door"
        value={values.deliveryInstructions}
        onChange={handleChange}
        error={errors.deliveryInstructions}
        rows={2}
      />

      <Checkbox id="isDefault" name="isDefault" label="Set as default address" checked={values.isDefault} onChange={handleChange} />

      {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>{isEdit ? 'Save changes' : 'Save address'}</Button>
      </div>
    </form>
  );
}