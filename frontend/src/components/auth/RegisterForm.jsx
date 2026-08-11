'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { register } from '@/services/authService';
import { validateRegisterForm } from '@/utils/registerValidation';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const { isValid, errors: clientErrors } = validateRegisterForm(values);
    if (!isValid) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(values);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 422 && err.errors?.length) {
          const fieldErrors = {};
          err.errors.forEach(({ field, message }) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
        } else if (err.statusCode === 409) {
          setErrors({ email: err.message });
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

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <SuccessMessage message="Account created! Check your email to verify your account before logging in." />
        <p className="text-center text-sm text-gray-500">
          Didn&apos;t get an email?{' '}
          <Link href="/verify-email" className="font-medium text-primary-600 hover:underline">
            Resend verification
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Create your account</h1>

      <Input
        id="firstName"
        name="firstName"
        label="First name"
        value={values.firstName}
        onChange={handleChange}
        error={errors.firstName}
        autoComplete="given-name"
      />

      <Input
        id="lastName"
        name="lastName"
        label="Last name"
        value={values.lastName}
        onChange={handleChange}
        error={errors.lastName}
        autoComplete="family-name"
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {serverError && (
        <p role="alert" className="text-sm font-medium text-danger-600">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}