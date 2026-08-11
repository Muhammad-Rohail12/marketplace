'use client';

import { useApi } from '@/hooks/useApi';
import { fetchTestConnection } from '@/services/api';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import ErrorState from '../feedback/ErrorState';
import SuccessMessage from '../feedback/SuccessMessage';

export default function ConnectionStatus() {
  const { data, error, loading, execute } = useApi(fetchTestConnection);

  return (
    <Card className="w-full max-w-md">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Backend Connection Test
      </h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner size={18} />
          Checking connection...
        </div>
      )}

      {!loading && data && <SuccessMessage message={`✓ ${data.message}`} />}

      {!loading && error && (
        <ErrorState
          message="Could not reach the backend API. Is it running on port 5000?"
          onRetry={execute}
        />
      )}
    </Card>
  );
}