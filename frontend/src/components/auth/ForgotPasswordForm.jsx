'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { forgotPassword } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';
import { isValidEmail, isNotEmpty } from '@/utils/validators';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const trimmed = email.trim();
    if (!isNotEmpty(trimmed)) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await forgotPassword(trimmed.toLowerCase());
      setIsSuccess(true);
      setServerError('');
      // Message is stored via isSuccess branch below, using res.message
      setSuccessMessageRef(res.message);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 422 && err.errors?.length) {
          setError(err.errors[0].message);
        } else if (err.statusCode === 0) {
          setServerError('Could not reach the server. Please check your connection and try again.');
        } else {
          setServerError(err.message || 'Something went wrong. Please try again.');
        }
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [successMessage, setSuccessMessageRef] = useState(
    'If an account with that email exists, a password reset link has been sent.'
  );

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <SuccessMessage message={successMessage} />
        <p className="text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={email}
        onChange={handleChange}
        error={error}
        autoComplete="email"
      />

      {serverError && (
        <p role="alert" className="text-sm font-medium text-danger-600">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Send reset link
      </Button>

      <p className="text-center text-sm text-gray-500">
        Remembered your password?{' '}
        <Link href={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}