'use client';

import Modal from '@/components/ui/Modal';

// Generic, category-agnostic reference table — no real per-category
// or per-seller size chart data exists in the backend (Phase
// 19/22's PIM system stores attribute VALUES like "Large", not
// measurement charts). Clearly labeled as general guidance rather
// than presented as product-specific data.
const GENERIC_SIZES = [
  { size: 'S', chest: '34-36"', waist: '28-30"' },
  { size: 'M', chest: '38-40"', waist: '32-34"' },
  { size: 'L', chest: '42-44"', waist: '36-38"' },
  { size: 'XL', chest: '46-48"', waist: '40-42"' },
];

export default function SizeGuideModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide">
      <p className="mb-3 text-xs text-neutral-500">
        General US sizing reference. Exact fit may vary by brand and style — check the product description for specifics.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Size</th>
            <th className="py-2">Chest</th>
            <th className="py-2">Waist</th>
          </tr>
        </thead>
        <tbody>
          {GENERIC_SIZES.map((row) => (
            <tr key={row.size} className="border-b border-neutral-100 dark:border-neutral-900">
              <td className="py-2 font-medium">{row.size}</td>
              <td className="py-2">{row.chest}</td>
              <td className="py-2">{row.waist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}