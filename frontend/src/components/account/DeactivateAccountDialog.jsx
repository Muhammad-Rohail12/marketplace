'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { deactivateAccount } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';

export default function DeactivateAccountDialog({ isOpen, onClose }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      await deactivateAccount(password);
      await logout(); // clears local auth state — server-side session already revoked
      onClose();
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deactivate your account">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your account will be deactivated and you&apos;ll be logged out everywhere. Your data is preserved — contact
          support to reactivate.
        </p>

        <PasswordInput
          id="deactivate-password"
          label="Confirm your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          error={error}
          autoComplete="current-password"
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isSubmitting}>
            Deactivate account
          </Button>
        </div>
      </div>
    </Modal>
  );
}