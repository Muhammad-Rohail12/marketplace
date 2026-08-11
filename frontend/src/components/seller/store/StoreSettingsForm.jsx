'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { storeService } from '@/services/storeService';
import { ApiError } from '@/lib/apiClient';

const FIELDS = [
  ['name', 'Store name'],
  ['shortDescription', 'Short description'],
  ['email', 'Contact email'],
  ['phone', 'Contact phone'],
  ['website', 'Website'],
  ['country', 'Country'],
  ['stateProvince', 'State / Province'],
  ['city', 'City'],
  ['address', 'Address'],
  ['postalCode', 'Postal code'],
];

export default function StoreSettingsForm({ store, onUpdated }) {
  const [values, setValues] = useState({
    name: store.name || '',
    shortDescription: store.shortDescription || '',
    description: store.description || '',
    email: store.email || '',
    phone: store.phone || '',
    website: store.website || '',
    country: store.country || '',
    stateProvince: store.stateProvince || '',
    city: store.city || '',
    address: store.address || '',
    postalCode: store.postalCode || '',
    showContactInformation: store.showContactInformation ?? true,
    seoTitle: store.seoTitle || '',
    seoDescription: store.seoDescription || '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const res = await storeService.updateMyStore(values);
      onUpdated(res.data.store);
      setSuccessMessage('Store updated successfully');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 422 && err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {FIELDS.map(([name, label]) => (
        <Input key={name} id={name} name={name} label={label} value={values[name]} onChange={handleChange} error={errors[name]} />
      ))}

      <Textarea id="description" name="description" label="Full description" value={values.description} onChange={handleChange} error={errors.description} />

      <Checkbox
        id="showContactInformation"
        name="showContactInformation"
        label="Show contact information on public store page"
        checked={values.showContactInformation}
        onChange={handleChange}
      />

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-gray-600">SEO settings</summary>
        <div className="mt-3 flex flex-col gap-3">
          <Input id="seoTitle" name="seoTitle" label="SEO title" value={values.seoTitle} onChange={handleChange} error={errors.seoTitle} />
          <Textarea id="seoDescription" name="seoDescription" label="SEO description" value={values.seoDescription} onChange={handleChange} error={errors.seoDescription} />
        </div>
      </details>

      {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Save Changes
      </Button>
    </form>
  );
}