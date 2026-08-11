import ApplicationStatusBadge from './ApplicationStatusBadge';
import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';

export default function ApplicationStatusView({ application, onCancel, isCancelling }) {
  const canCancel = ['SUBMITTED', 'UNDER_REVIEW'].includes(application.status);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{application.businessName}</h2>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {application.submittedAt && (
        <p className="text-sm text-gray-500">Submitted: {formatDate(application.submittedAt)}</p>
      )}

      {application.status === 'REJECTED' && application.rejectionReason && (
        <div className="rounded-md bg-danger-500/10 p-3 text-sm text-danger-600">
          <strong>Reason:</strong> {application.rejectionReason}
        </div>
      )}

      {application.status === 'APPROVED' && (
        <p className="text-sm text-success-600">
            🎉 You are an approved seller! Seller store features are coming soon.
        </p>
      )}

      {application.status === 'SUSPENDED' && (
        <p className="text-sm text-danger-600">Your seller access has been suspended.</p>
      )}

      {canCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isCancelling}
          className="self-start text-sm font-medium text-danger-600 hover:underline disabled:opacity-50"
        >
          Cancel application
        </button>
      )}
    </Card>
  );
}