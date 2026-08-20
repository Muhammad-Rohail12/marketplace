'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BecomeSellerHero from '@/components/seller/BecomeSellerHero';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import SellerApplicationForm from '@/components/seller/SellerApplicationForm';
import SellerApplicationStatus from '@/components/seller/ApplicationStatusView';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { ROLES } from '@/constants/roles';

function SellPageContent() {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => sellerApplicationService.getOrCreateDraft()
    .then((res) => setApplication(res.data.application))
    .finally(() => setIsLoading(false));

  useEffect(() => { load(); }, []);

  if (isLoading) return <PageLoader label="Loading..." />;

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      {application?.status === 'DRAFT' && <BecomeSellerHero />}

      <Card>
        {application?.status === 'DRAFT' ? (
          <SellerApplicationForm application={application} onUpdated={load} />
        ) : (
          <SellerApplicationStatus application={application} />
        )}
      </Card>
    </div>
  );
}

export default function SellPage() {
  return (
    <MainLayout>
      <ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER]}>
        <SellPageContent />
      </ProtectedRoute>
    </MainLayout>
  );
}