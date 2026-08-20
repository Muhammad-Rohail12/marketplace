'use client';

import { useState } from 'react';
import { FiShare2, FiLink, FiCheck } from 'react-icons/fi';
import { useToast } from '@/context/ToastContext';

export default function ShareProductButtons({ productName }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link copied to clipboard', 'success', 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url: window.location.href });
      } catch {
        // User cancelled — no error toast needed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={handleNativeShare} className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
        <FiShare2 size={13} /> Share
      </button>
      <button type="button" onClick={handleCopyLink} className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
        {copied ? <FiCheck size={13} className="text-success-600" /> : <FiLink size={13} />} {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
}