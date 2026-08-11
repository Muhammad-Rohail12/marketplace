'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import { inventoryService } from '@/services/inventoryService';
import { formatDate } from '@/utils/formatDate';

export default function StockHistoryModal({ isOpen, onClose, inventoryItem }) {
  const [movements, setMovements] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !inventoryItem) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    inventoryService.getHistory(inventoryItem.id, { page, limit: 15 }).then((res) => {
      setMovements(res.data.movements);
      setMeta(res.meta);
      setIsLoading(false);
    });
  }, [isOpen, inventoryItem, page]);

  if (!inventoryItem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Stock History — ${inventoryItem.product?.name || ''}`} className="max-w-2xl">
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {movements.length === 0 && <p className="text-sm text-gray-500">No stock movements yet.</p>}
          {movements.map((m) => (
            <div key={m.id} className="border-b border-gray-100 pb-2 text-sm dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-medium">{m.type.replace(/_/g, ' ')}</span>
                <span className={m.quantity >= 0 ? 'text-success-600' : 'text-danger-600'}>
                  {m.quantity >= 0 ? '+' : ''}{m.quantity}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {m.previousQuantity} → {m.newQuantity} · {formatDate(m.createdAt, { hour: '2-digit', minute: '2-digit' })}
              </p>
              {m.reason && <p className="text-xs text-gray-400">{m.reason}</p>}
            </div>
          ))}
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
        </div>
      )}
    </Modal>
  );
}