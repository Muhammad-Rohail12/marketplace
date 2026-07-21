'use client';

import { useEffect, useState } from 'react';
import { fetchTestConnection } from '@/services/api';

export default function ConnectionStatus() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchTestConnection()
      .then((data) => {
        if (!isMounted) return;
        setStatus('success');
        setMessage(data.message);
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Could not reach the backend API. Is it running on port 5000?');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full max-w-md rounded-lg border p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Backend Connection Test
      </h2>

      {status === 'loading' && (
        <p className="text-gray-600">Checking connection to backend...</p>
      )}

      {status === 'success' && (
        <p className="font-medium text-green-600">✓ {message}</p>
      )}

      {status === 'error' && (
        <p className="font-medium text-red-600">✗ {message}</p>
      )}
    </div>
  );
}