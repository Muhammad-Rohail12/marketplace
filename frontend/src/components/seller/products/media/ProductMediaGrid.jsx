'use client';

import { useState } from 'react';
import ProductMediaItem from './ProductMediaItem';

// Simple move-up/move-down reordering (accessible, keyboard-friendly)
// rather than a drag library — satisfies "reorder" requirement
// without adding a heavy DnD dependency. Drag-and-drop upload
// (separate concern) IS implemented in MediaUploadDropzone.
export default function ProductMediaGrid({ media, onSetPrimary, onDelete, onSaveMetadata, onReplace, onReorder }) {
  const [items, setItems] = useState(media);

  useState(() => setItems(media), [media]);

  const move = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
    onReorder(newItems.map((m) => m.id));
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((m, i) => (
        <div key={m.id} className="flex flex-col gap-1">
          <ProductMediaItem
            media={m}
            onSetPrimary={onSetPrimary}
            onDelete={onDelete}
            onSaveMetadata={onSaveMetadata}
            onReplace={onReplace}
          />
          <div className="flex justify-center gap-1">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-xs text-gray-500 disabled:opacity-30" aria-label="Move earlier">◀</button>
            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="text-xs text-gray-500 disabled:opacity-30" aria-label="Move later">▶</button>
          </div>
        </div>
      ))}
    </div>
  );
}