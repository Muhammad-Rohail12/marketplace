'use client';

import { useMemo, useState, useEffect } from 'react';
import AttributeSelector from '@/components/pim/AttributeSelector';

// Derives the set of variant-defining attributes (Color, Size, etc.)
// directly from the product's real VariantCombination rows (Phase
// 22), then reuses Phase 19's AttributeSelector for each one. Once
// every attribute has a selection, resolves the matching real
// VariantCombination and reports its id up via onVariantResolved —
// closing the gap Phase 26 explicitly flagged (selectedVariantId was
// always null on the public product page).
export default function VariantSelector({ variants = [], onVariantResolved }) {
  const attributeMap = useMemo(() => {
    const map = new Map();
    variants.forEach((v) => {
      v.options.forEach((opt) => {
        const attr = opt.variantOption.attribute;
        const val = opt.variantOption.attributeValue;
        if (!map.has(attr.id)) map.set(attr.id, { id: attr.id, name: attr.name, type: attr.type, values: new Map() });
        map.get(attr.id).values.set(val.id, val);
      });
    });
    return Array.from(map.values()).map((a) => ({ ...a, values: Array.from(a.values.values()) }));
  }, [variants]);

  const [selections, setSelections] = useState({});

  const resolvedVariant = useMemo(() => {
    if (attributeMap.length === 0 || Object.keys(selections).length !== attributeMap.length) return null;
    return variants.find((v) =>
      v.options.length === attributeMap.length &&
      v.options.every((opt) => selections[opt.variantOption.attribute.id] === opt.variantOption.attributeValue.id)
    ) || null;
  }, [selections, attributeMap, variants]);

  useEffect(() => {
    onVariantResolved(resolvedVariant);
  }, [resolvedVariant, onVariantResolved]);

  if (attributeMap.length === 0) return null;

  const handleSelect = (attributeId, value) => {
    setSelections((prev) => ({ ...prev, [attributeId]: value?.id }));
  };

  return (
    <div className="flex flex-col gap-4">
      {attributeMap.map((attribute) => (
        <div key={attribute.id}>
          <p className="mb-1.5 text-sm font-medium">
            {attribute.name}
            {selections[attribute.id] && (
              <span className="ml-1 font-normal text-neutral-500">
                — {attribute.values.find((v) => v.id === selections[attribute.id])?.label}
              </span>
            )}
          </p>
          <AttributeSelector
            attribute={attribute}
            selectedId={selections[attribute.id]}
            onSelect={(value) => handleSelect(attribute.id, value)}
          />
        </div>
      ))}
      {Object.keys(selections).length === attributeMap.length && !resolvedVariant && (
        <p className="text-xs text-danger-600">This combination is not currently available.</p>
      )}
    </div>
  );
}