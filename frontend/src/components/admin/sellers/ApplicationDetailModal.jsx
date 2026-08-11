'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import ApplicationStatusBadge from '@/components/seller/ApplicationStatusBadge';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { formatDate } from '@/utils/formatDate';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm">{value || '—'}</p>
    </div>
  );
}

export default function ApplicationDetailModal({ isOpen, onClose, application, onChanged }) {
  const [adminNotes, setAdminNotes] = useState(application?.adminNotes || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!application) return null;

  const runAction = async (fn) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fn();
      onChanged(res.data.application);
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => runAction(() => sellerApplicationService.startReview(application.id));
  const handleApprove = () => runAction(() => sellerApplicationService.approve(application.id, adminNotes));
  const handleSuspend = () => runAction(() => sellerApplicationService.suspend(application.id, adminNotes));
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError('A rejection reason is required');
      return;
    }
    runAction(() => sellerApplicationService.reject(application.id, rejectionReason));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seller Application" className="max-w-2xl">
      <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{application.businessName}</h3>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Applicant" value={`${application.applicant?.firstName} ${application.applicant?.lastName}`} />
          <Field label="Applicant email" value={application.applicant?.email} />
          <Field label="Business type" value={application.businessType} />
          <Field label="Contact name" value={application.contactName} />
          <Field label="Contact email" value={application.contactEmail} />
          <Field label="Contact phone" value={application.contactPhone} />
          <Field label="Country" value={application.country} />
          <Field label="State/Province" value={application.stateProvince} />
          <Field label="City" value={application.city} />
          <Field label="Postal code" value={application.postalCode} />
          <Field label="Address" value={application.address} />
          <Field label="Submitted" value={application.submittedAt ? formatDate(application.submittedAt) : '—'} />
        </div>

        {application.businessDescription && <Field label="Description" value={application.businessDescription} />}

        {application.status === 'REJECTED' && application.rejectionReason && (
          <Field label="Rejection reason" value={application.rejectionReason} />
        )}

        <div>
          <label className="text-xs text-gray-500">Internal admin notes (not visible to applicant)</label>
          <Textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
          />
        </div>

        {showRejectForm && (
          <div>
            <label className="text-xs text-gray-500">Rejection reason (shown to applicant)</label>
            <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={2} />
          </div>
        )}

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          {application.status === 'SUBMITTED' && (
            <Button size="sm" onClick={handleReview} isLoading={isSubmitting}>Start Review</Button>
          )}
          {application.status === 'UNDER_REVIEW' && !showRejectForm && (
            <>
              <Button size="sm" onClick={handleApprove} isLoading={isSubmitting}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => setShowRejectForm(true)}>Reject</Button>
            </>
          )}
          {showRejectForm && (
            <>
              <Button size="sm" variant="danger" onClick={handleReject} isLoading={isSubmitting}>Confirm Rejection</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowRejectForm(false)}>Cancel</Button>
            </>
          )}
          {application.status === 'APPROVED' && (
            <Button size="sm" variant="danger" onClick={handleSuspend} isLoading={isSubmitting}>Suspend Seller</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}