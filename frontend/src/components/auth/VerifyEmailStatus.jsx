'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ErrorState from '@/components/feedback/ErrorState';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { verifyEmail, resendVerification } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';
import { isValidEmail } from '@/utils/validators';

export default function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isMissingToken = !token;

  const [status, setStatus] = useState('loading'); // loading | success | already | failed
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendState, setResendState] = useState('idle'); // idle | sending | sent
  const [resendError, setResendError] = useState('');

  const currentStatus = isMissingToken ? 'failed' : status;
  const currentMessage = isMissingToken
    ? 'This verification link is missing a token. Request a new one below.'
    : message;

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus(res.data.alreadyVerified ? 'already' : 'success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('failed');
        setMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendError('');

    if (!isValidEmail(resendEmail)) {
      setResendError('Enter a valid email address');
      return;
    }

    setResendState('sending');
    try {
      await resendVerification(resendEmail);
      setResendState('sent');
    } catch (err) {
      setResendState('idle');
      setResendError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner size={28} />
        <p className="text-sm text-gray-500">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success' || status === 'already') {
    return (
      <div className="flex flex-col gap-4">
        <SuccessMessage message={message} />
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:focus-ring"
        >
          Continue to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ErrorState message={message} />

      {resendState === 'sent' ? (
        <SuccessMessage message="If that email is registered and unverified, a new link is on its way." />
      ) : (
        <form onSubmit={handleResend} className="flex flex-col gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your email to request a new verification link.
          </p>
          <Input
            id="resend-email"
            label="Email"
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            error={resendError}
          />
          <Button type="submit" isLoading={resendState === 'sending'}>
            Resend Verification Email
          </Button>
        </form>
      )}
    </div>
  );
}