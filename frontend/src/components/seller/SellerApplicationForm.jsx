'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { ApiError } from '@/lib/apiClient';

const REQUIRED_FIELDS = [
  ['businessName', 'Business name'],
  ['businessType', 'Business type'],
  ['contactName', 'Contact name'],
  ['contactEmail', 'Contact email'],
  ['contactPhone', 'Contact phone'],
  ['country', 'Country'],
  ['stateProvince', 'State / Province'],
  ['city', 'City'],
  ['address', 'Address'],
  ['postalCode', 'Postal code'],
];

export default function SellerApplicationForm({ application, onUpdated, onSubmitted }) {
  const [values, setValues] = useState({
    businessName: application.businessName || '',
    businessType: application.businessType || '',
    businessDescription: application.businessDescription || '',
    contactName: application.contactName || '',
    contactEmail: application.contactEmail || '',
    contactPhone: application.contactPhone || '',
    country: application.country || '',
    stateProvince: application.stateProvince || '',
    city: application.city || '',
    address: application.address || '',
    postalCode: application.postalCode || '',
    taxInformation: application.taxInformation || '',
    businessRegistrationNumber: application.businessRegistrationNumber || '',
    termsAccepted: application.termsAccepted || false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  };

  const handleApiError = (err) => {
    if (err instanceof ApiError && err.errors?.length) {
      const fieldErrors = {};
      err.errors.forEach(({ field, message }) => {
        fieldErrors[field] = message;
      });
      setErrors(fieldErrors);
    } else {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
    setServerError('');
    setIsSavingDraft(true);
    try {
      const res = await sellerApplicationService.updateDraft(application.id, values);
      onUpdated(res.data.application);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);
    try {
      const res = await sellerApplicationService.submit(application.id, values);
      onSubmitted(res.data.application);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {REQUIRED_FIELDS.map(([name, label]) => (
        <Input key={name} id={name} name={name} label={label} value={values[name]} onChange={handleChange} error={errors[name]} />
      ))}

      <Textarea
        id="businessDescription"
        name="businessDescription"
        label="Business description (optional)"
        value={values.businessDescription}
        onChange={handleChange}
        error={errors.businessDescription}
      />

      <Input
        id="businessRegistrationNumber"
        name="businessRegistrationNumber"
        label="Business registration number (optional)"
        value={values.businessRegistrationNumber}
        onChange={handleChange}
      />

      <Input
        id="taxInformation"
        name="taxInformation"
        label="Tax information (optional)"
        value={values.taxInformation}
        onChange={handleChange}
      />

      <Checkbox
        id="termsAccepted"
        name="termsAccepted"
        label="I accept the Seller Terms & Conditions"
        checked={values.termsAccepted}
        onChange={handleChange}
      />
      {errors.termsAccepted && <p className="text-sm text-danger-500">{errors.termsAccepted}</p>}

      {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={handleSaveDraft} isLoading={isSavingDraft}>
          Save Draft
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Submit Application
        </Button>
      </div>
    </form>
  );
}