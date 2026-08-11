'use client';

import { useState } from 'react';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { storeService } from '@/services/storeService';

const POLICY_TYPES = [
  ['RETURN', 'Return Policy'],
  ['SHIPPING', 'Shipping Policy'],
  ['CANCELLATION', 'Cancellation Policy'],
  ['PRIVACY', 'Privacy Policy'],
  ['TERMS', 'Store Terms'],
];

export default function StorePolicyForm({ store, onUpdated }) {
  const existing = Object.fromEntries((store.policies || []).map((p) => [p.type, p.content]));
  const [values, setValues] = useState(Object.fromEntries(POLICY_TYPES.map(([type]) => [type, existing[type] || ''])));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const policies = POLICY_TYPES.filter(([type]) => values[type].trim()).map(([type]) => ({ type, content: values[type].trim() }));
      const res = await storeService.updatePolicies(policies);
      onUpdated(res.data.store);
      setSuccessMessage('Policies updated');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {POLICY_TYPES.map(([type, label]) => (
        <Textarea
          key={type}
          id={`policy-${type}`}
          label={label}
          value={values[type]}
          onChange={(e) => setValues((prev) => ({ ...prev, [type]: e.target.value }))}
        />
      ))}

      {error && <p className="text-sm text-danger-600">{error}</p>}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Save Policies
      </Button>
    </form>
  );
}