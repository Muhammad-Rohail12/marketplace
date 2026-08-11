'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';
import { isValidEmail, isNotEmpty } from '@/utils/validators';

const INITIAL_VALUES = { email: '', password: '', rememberMe: false };

function validateLoginForm(values) {
  const errors = {};

  if (!isNotEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
    setUnverifiedEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setUnverifiedEmail('');

    const { isValid, errors: clientErrors } = validateLoginForm(values);
    if (!isValid) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: values.email.trim().toLowerCase(), password: values.password });
      router.push(ROUTES.HOME);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 422 && err.errors?.length) {
          const fieldErrors = {};
          err.errors.forEach(({ field, message }) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
        } else if (err.statusCode === 401) {
          setServerError(err.message); // "Incorrect email or password"
        } else if (err.errorCode === 'EMAIL_NOT_VERIFIED') {
          setServerError(err.message);
          setUnverifiedEmail(values.email.trim().toLowerCase());
        } else if (err.errorCode === 'ACCOUNT_DISABLED') {
          setServerError(err.message);
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

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Log in to your account</h1>

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
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          label="Remember me"
          checked={values.rememberMe}
          onChange={handleChange}
        />
        <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      {serverError && (
        <div role="alert" className="flex flex-col gap-1">
          <p className="text-sm font-medium text-danger-600">{serverError}</p>
          {unverifiedEmail && (
            <Link
              href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              Resend verification email
            </Link>
          )}
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Log in
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.REGISTER} className="font-medium text-primary-600 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}