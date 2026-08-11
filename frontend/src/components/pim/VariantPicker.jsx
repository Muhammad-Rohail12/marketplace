'use client';

import { useState } from 'react';
import AttributeSelector from './AttributeSelector';

// Renders one AttributeSelector per variant-defining attribute.
// Foundation only — not wired to any product/cart logic yet.
export default function VariantPicker({ variantAttributes = [], onChange }) {
  const [selections, setSelections] = useState({});

  const handleSelect = (attributeId, value) => {
    const next = { ...selections, [attributeId]: value };
    setSelections(next);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {variantAttributes.map((attr) => (
        <div key={attr.id}>
          <p className="mb-1 text-sm font-medium">{attr.name}</p>
          <AttributeSelector
            attribute={attr}
            selectedId={selections[attr.id]?.id}
            onSelect={(value) => handleSelect(attr.id, value)}
          />
        </div>
      ))}
    </div>
  );
}