'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '@/components/ui/PasswordInput';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ErrorState from '@/components/feedback/ErrorState';
import { resetPassword } from '@/services/authService';
import { isStrongPassword } from '@/utils/validators';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';

function validateForm(values) {
  const errors = {};

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'Must be 8+ characters with uppercase, lowercase, and a number';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [tokenError, setTokenError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setTokenError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTokenError('');

    if (!token) {
      setTokenError('This reset link is missing a token. Please request a new one.');
      return;
    }

    const { isValid, errors: clientErrors } = validateForm(values);
    if (!isValid) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({ token, password: values.password, confirmPassword: values.confirmPassword });
      setIsSuccess(true);
      setTimeout(() => router.push(ROUTES.LOGIN), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 422 && err.errors?.length) {
          const fieldErrors = {};
          err.errors.forEach(({ field, message }) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
        } else if (['INVALID_TOKEN', 'TOKEN_EXPIRED', 'TOKEN_ALREADY_USED'].includes(err.errorCode)) {
          setTokenError(err.message);
        } else if (err.statusCode === 0) {
          setTokenError('Could not reach the server. Please check your connection and try again.');
        } else {
          setTokenError(err.message || 'Something went wrong. Please try again.');
        }
      } else {
        setTokenError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessMessage message="Password reset successful! Redirecting to login..." />;
  }

  if (!token || tokenError) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorState message={tokenError || 'This reset link is missing a token.'} />
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:focus-ring"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Set a new password</h1>

      <div className="flex flex-col gap-2">
        <PasswordInput
          id="password"
          name="password"
          label="New password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        <PasswordStrengthIndicator password={values.password} />
      </div>

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm new password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Reset password
      </Button>
    </form>
  );
}