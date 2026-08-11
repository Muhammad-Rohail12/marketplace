'use client';

import { useEffect, useState } from 'react';
import { pimService } from '@/services/pimService';
import AttributeSelector from '@/components/pim/AttributeSelector';

// Reuses Phase 19's AttributeSelector directly — category-driven
// attribute list comes from CategoryAttribute assignments.
export default function ProductAttributesForm({ categoryId, values, onChange }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    pimService.listCategoryAttributes(categoryId).then((res) => setAssignments(res.data.assignments));
  }, [categoryId]);

  if (!categoryId) return <p className="text-sm text-gray-500">Select a category first to see its attributes.</p>;
  if (!assignments.length) return <p className="text-sm text-gray-500">This category has no configured attributes.</p>;

  return (
    <div className="flex flex-col gap-4">
      {assignments.map(({ attribute, isRequired }) => (
        <div key={attribute.id}>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium">
            {attribute.name} {isRequired && <span className="text-danger-500">*</span>}
          </label>
          <AttributeSelector
            attribute={attribute}
            selectedId={values[attribute.id]?.attributeValueId}
            onSelect={(v) => onChange(attribute.id, { attributeValueId: v?.id, value: v?.label })}
          />
        </div>
      ))}
    </div>
  );
}