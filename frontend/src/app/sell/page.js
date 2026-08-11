'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import SellerApplicationForm from '@/components/seller/SellerApplicationForm';
import ApplicationStatusView from '@/components/seller/ApplicationStatusView';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { useAuth } from '@/context/AuthContext';

function SellPageContent() {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await sellerApplicationService.getOrCreateDraft();
      setApplication(res.data.application);
    } catch (err) {
      setLoadError(err.message || 'Failed to load your application');
    } finally {
      setIsLoading(false);
    }
  };
  
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this application?')) return;
    setIsCancelling(true);
    try {
      const res = await sellerApplicationService.cancel(application.id);
      setApplication(res.data.application);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading..." />;

  if (loadError) {
    return (
      <div className="container-page py-10">
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col gap-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Become a Seller</h1>
        <p className="mt-1 text-gray-500">
          Apply to sell on Marketplace. Our team will review your application and get back to you.
        </p>
      </div>

      {application.status === 'DRAFT' ? (
        <SellerApplicationForm application={application} onUpdated={setApplication} onSubmitted={setApplication} />
      ) : (
        <ApplicationStatusView application={application} onCancel={handleCancel} isCancelling={isCancelling} />
      )}
    </div>
  );
}

export default function SellPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <SellPageContent />
      </ProtectedRoute>
    </MainLayout>
  );
}