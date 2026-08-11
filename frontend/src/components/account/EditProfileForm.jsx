'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { updateMyProfile } from '@/services/userService';
import { ApiError } from '@/lib/apiClient';
import { isValidPhone, isNotEmpty } from '@/utils/validators';

const GENDER_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

function toDateInputValue(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().slice(0, 10);
}

export default function EditProfileForm({ user, onUpdated }) {
  const [values, setValues] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    dateOfBirth: toDateInputValue(user.dateOfBirth),
    gender: user.gender || '',
    timeZone: user.timeZone || '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
    setSuccessMessage('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!isNotEmpty(values.firstName)) nextErrors.firstName = 'First name is required';
    if (!isNotEmpty(values.lastName)) nextErrors.lastName = 'Last name is required';
    if (values.phone && !isValidPhone(values.phone)) nextErrors.phone = 'Enter a valid phone number';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateMyProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim() || null,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        timeZone: values.timeZone || null,
      });
      onUpdated(res.data.user);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 422 && err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else if (err instanceof ApiError) {
        setServerError(err.message || 'Something went wrong. Please try again.');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="firstName"
          name="firstName"
          label="First name"
          value={values.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Input
          id="lastName"
          name="lastName"
          label="Last name"
          value={values.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
      </div>

      <Input
        id="phone"
        name="phone"
        label="Phone number"
        value={values.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="+1234567890"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          label="Date of birth"
          value={values.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
        />
        <Select
          id="gender"
          name="gender"
          label="Gender"
          value={values.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
        />
      </div>

      <Input
        id="timeZone"
        name="timeZone"
        label="Time zone"
        value={values.timeZone}
        onChange={handleChange}
        error={errors.timeZone}
        placeholder="e.g. Asia/Karachi"
      />

      {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Save changes
      </Button>
    </form>
  );
}