'use client';

import { useState } from 'react';
import PasswordInput from '@/components/ui/PasswordInput';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { changePassword } from '@/services/userService';
import { isStrongPassword } from '@/utils/validators';
import { ApiError } from '@/lib/apiClient';

export default function ChangePasswordForm() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
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
    if (!values.currentPassword) nextErrors.currentPassword = 'Current password is required';
    if (!values.newPassword) {
      nextErrors.newPassword = 'New password is required';
    } else if (!isStrongPassword(values.newPassword)) {
      nextErrors.newPassword = 'Must be 8+ characters with uppercase, lowercase, and a number';
    }
    if (!values.confirmNewPassword) {
      nextErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (values.newPassword && values.confirmNewPassword !== values.newPassword) {
      nextErrors.confirmNewPassword = 'Passwords do not match';
    }
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
      const res = await changePassword(values);
      setSuccessMessage(res.message);
      setValues({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 422 && err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else if (err instanceof ApiError && err.errorCode === 'INCORRECT_PASSWORD') {
        setErrors({ currentPassword: err.message });
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
      <PasswordInput
        id="currentPassword"
        name="currentPassword"
        label="Current password"
        value={values.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
        autoComplete="current-password"
      />

      <div className="flex flex-col gap-2">
        <PasswordInput
          id="newPassword"
          name="newPassword"
          label="New password"
          value={values.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          autoComplete="new-password"
        />
        <PasswordStrengthIndicator password={values.newPassword} />
      </div>

      <PasswordInput
        id="confirmNewPassword"
        name="confirmNewPassword"
        label="Confirm new password"
        value={values.confirmNewPassword}
        onChange={handleChange}
        error={errors.confirmNewPassword}
        autoComplete="new-password"
      />

      {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Change password
      </Button>
    </form>
  );
}