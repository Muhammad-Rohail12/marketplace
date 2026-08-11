'use client';

import Button from '@/components/ui/Button';
import ApplicationStatusBadge from '@/components/seller/ApplicationStatusBadge';
import { formatDate } from '@/utils/formatDate';

export default function ApplicationTable({ applications, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Business</th>
            <th className="py-2 pr-4">Applicant</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Submitted</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{app.businessName || '—'}</td>
              <td className="py-2 pr-4">{app.applicant?.firstName} {app.applicant?.lastName}</td>
              <td className="py-2 pr-4"><ApplicationStatusBadge status={app.status} /></td>
              <td className="py-2 pr-4">{app.submittedAt ? formatDate(app.submittedAt) : '—'}</td>
              <td className="py-2 pr-4">
                <Button variant="ghost" size="sm" onClick={() => onView(app)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}