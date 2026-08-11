'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { pricingService } from '@/services/pricingService';
import { formatDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/currencyFormat';

export default function PriceHistoryModal({ isOpen, onClose, priceItem }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !priceItem) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    pricingService.getHistory(priceItem.id).then((res) => {
      setHistory(res.data.history);
      setIsLoading(false);
    });
  }, [isOpen, priceItem]);

  if (!priceItem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Price History — ${priceItem.product?.name || ''}`} className="max-w-lg">
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {history.length === 0 && <p className="text-sm text-gray-500">No history yet.</p>}
          {history.map((h) => (
            <div key={h.id} className="border-b border-gray-100 pb-2 text-sm dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-medium">{h.changeType.replace(/_/g, ' ')} — {h.field}</span>
                <span className="text-xs text-gray-500">{formatDate(h.createdAt, { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-500">
                {h.previousValue !== null ? formatMoney(h.previousValue, priceItem.currency) : '—'} → {h.newValue !== null ? formatMoney(h.newValue, priceItem.currency) : '—'}
              </p>
              {h.reason && <p className="text-xs text-gray-400">{h.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}