'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { useAuth } from '@/context/AuthContext';
import * as userService from '@/services/userService';

function ProfilePhotoTab({ user, onUpdated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const res = await userService.uploadProfileImage(file);
      onUpdated(res.data.user);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      const res = await userService.removeProfileImage();
      onUpdated(res.data.user);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveImageSrc(user.profileImage)} alt="" className="h-20 w-20 rounded-full object-cover" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-xl font-semibold text-neutral-400 dark:bg-neutral-800">
          {user.firstName?.[0]}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label className="cursor-pointer text-sm font-medium text-primary-600 hover:underline">
          {isUploading ? 'Uploading...' : 'Upload new photo'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
        {user.profileImage && (
          <button type="button" onClick={handleRemove} disabled={isUploading} className="text-left text-sm text-danger-600 hover:underline">Remove photo</button>
        )}
        {error && <p className="text-xs text-danger-600">{error}</p>}
      </div>
    </div>
  );
}

function EditDetailsTab({ user, onUpdated }) {
  const [values, setValues] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await userService.updateMyProfile(values);
      onUpdated(res.data.user);
      setMessage('Profile updated successfully');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input id="firstName" label="First name" value={values.firstName} onChange={(e) => setValues({ ...values, firstName: e.target.value })} />
        <Input id="lastName" label="Last name" value={values.lastName} onChange={(e) => setValues({ ...values, lastName: e.target.value })} />
      </div>
      <Input id="phone" label="Phone" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
      <Input id="email" label="Email" value={user.email} disabled />
      {message && <SuccessMessage message={message} />}
      <Button type="submit" isLoading={isSubmitting} className="self-start">Save Changes</Button>
    </form>
  );
}

function ChangePasswordTab() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (values.newPassword !== values.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await userService.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setMessage('Password changed successfully');
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <PasswordInput id="currentPassword" label="Current password" value={values.currentPassword} onChange={(e) => setValues({ ...values, currentPassword: e.target.value })} />
      <PasswordInput id="newPassword" label="New password" value={values.newPassword} onChange={(e) => setValues({ ...values, newPassword: e.target.value })} />
      <PasswordStrengthIndicator password={values.newPassword} />
      <PasswordInput id="confirmPassword" label="Confirm new password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} />
      {error && <p className="text-sm text-danger-600">{error}</p>}
      {message && <SuccessMessage message={message} />}
      <Button type="submit" isLoading={isSubmitting} className="self-start">Change Password</Button>
    </form>
  );
}

function DeactivateAccountTab() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const handleDeactivate = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await userService.deactivateAccount(password);
      logout();
    } catch (err) {
      setError(err.message || 'Failed to deactivate account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <p className="text-sm text-neutral-500">Deactivating your account will sign you out and disable access. This can typically be reversed by contacting support.</p>
      {!isConfirming ? (
        <Button variant="danger" onClick={() => setIsConfirming(true)} className="self-start">Deactivate Account</Button>
      ) : (
        <>
          <PasswordInput id="deactivate-password" label="Confirm your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-danger-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsConfirming(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeactivate} isLoading={isSubmitting}>Confirm Deactivation</Button>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCurrentUser(user); }, [user]);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Profile & Security</h1>
      <Card>
        <Tabs
          tabs={[
            { value: 'photo', label: 'Photo', content: <ProfilePhotoTab user={currentUser} onUpdated={(u) => { setCurrentUser(u); refreshUser?.(); }} /> },
            { value: 'details', label: 'Edit Details', content: <EditDetailsTab user={currentUser} onUpdated={(u) => { setCurrentUser(u); refreshUser?.(); }} /> },
            { value: 'password', label: 'Change Password', content: <ChangePasswordTab /> },
            { value: 'deactivate', label: 'Deactivate', content: <DeactivateAccountTab /> },
          ]}
        />
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AccountLayout>
      <ProtectedRoute>
        <ProfileContent />
      </ProtectedRoute>
    </AccountLayout>
  );
}