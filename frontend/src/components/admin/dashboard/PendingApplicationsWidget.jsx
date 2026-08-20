'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/feedback/EmptyState';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { formatDate } from '@/utils/formatDate';

export default function PendingApplicationsWidget() {
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    sellerApplicationService.listAll({ status: 'SUBMITTED', limit: 5 })
      .then((res) => setApplications(res.data.applications))
      .catch(() => setApplications([]));
  }, []);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Pending Seller Applications</h2>
        <Link href="/admin/sellers" className="text-xs font-medium text-primary-600 hover:underline">Review all →</Link>
      </div>
      {applications === null ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : applications.length === 0 ? (
        <EmptyState title="No pending applications" message="New seller applications will appear here." />
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
          {applications.map((app) => (
            <Link key={app.id} href="/admin/sellers" className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{app.businessName}</p>
                <p className="text-xs text-neutral-500">{app.applicant?.firstName} {app.applicant?.lastName} · {formatDate(app.submittedAt || app.createdAt)}</p>
              </div>
              <Badge variant="warning">Pending</Badge>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}