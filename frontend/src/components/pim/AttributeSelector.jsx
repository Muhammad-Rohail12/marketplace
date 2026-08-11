'use client';

import ColorSwatchSelector from './ColorSwatchSelector';
import SizeSelector from './SizeSelector';
import Select from '@/components/ui/Select';

// Generic dispatcher — picks the right selector UI based on
// attribute type. Foundation only; not connected to any product yet.
export default function AttributeSelector({ attribute, selectedId, onSelect }) {
  if (!attribute) return null;

  if (attribute.type === 'COLOR') {
    return <ColorSwatchSelector values={attribute.values || []} selectedId={selectedId} onSelect={onSelect} />;
  }

  if (attribute.type === 'SIZE') {
    return <SizeSelector values={attribute.values || []} selectedId={selectedId} onSelect={onSelect} />;
  }

  const options = (attribute.values || []).map((v) => ({ value: v.id, label: v.label }));
  return (
    <Select
      id={`attr-${attribute.id}`}
      label={attribute.name}
      value={selectedId || ''}
      onChange={(e) => onSelect?.((attribute.values || []).find((v) => String(v.id) === e.target.value))}
      options={[{ value: '', label: `Select ${attribute.name}` }, ...options]}
    />
  );
}