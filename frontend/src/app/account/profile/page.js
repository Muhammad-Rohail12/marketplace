'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import ProfileImageUpload from '@/components/account/ProfileImageUpload';
import EditProfileForm from '@/components/account/EditProfileForm';
import ChangePasswordForm from '@/components/account/ChangePasswordForm';
import AccountInfoCard from '@/components/account/AccountInfoCard';
import DeactivateAccountDialog from '@/components/account/DeactivateAccountDialog';
import Button from '@/components/ui/Button';
import { getMyProfile } from '@/services/userService';
import { useModal } from '@/hooks/useModal';

function ProfileContent() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const deactivateModal = useModal(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => setUser(res.data.user))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader label="Loading your profile..." />;
  if (!user) return null;

  return (
    <div className="container-page flex flex-col gap-6 py-10">
      <h1 className="text-2xl font-semibold">Account Settings</h1>

      <Card>
        <ProfileImageUpload user={user} onUpdated={setUser} />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Personal Information</h2>
        <EditProfileForm user={user} onUpdated={setUser} />
      </Card>

      <AccountInfoCard user={user} />

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Security</h2>
        <ChangePasswordForm />
      </Card>

      <Card className="border-danger-500/30">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-danger-600">Danger Zone</h2>
        <p className="mb-3 text-sm text-gray-500">Deactivating your account will log you out everywhere.</p>
        <Button variant="danger" size="sm" onClick={deactivateModal.open}>
          Deactivate account
        </Button>
      </Card>

      <DeactivateAccountDialog isOpen={deactivateModal.isOpen} onClose={deactivateModal.close} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <ProfileContent />
      </ProtectedRoute>
    </MainLayout>
  );
}