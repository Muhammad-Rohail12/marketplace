'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ProductSpecificationsForm({ specifications = [], onChange }) {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [group, setGroup] = useState('GENERAL');

  const addSpec = () => {
    if (!label.trim() || !value.trim()) return;
    onChange([...specifications, { label: label.trim(), value: value.trim(), group, displayOrder: specifications.length }]);
    setLabel(''); setValue('');
  };

  const removeSpec = (index) => onChange(specifications.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        <Input placeholder="Label (e.g. Material)" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Input placeholder="Value (e.g. Cotton)" value={value} onChange={(e) => setValue(e.target.value)} />
        <Select value={group} onChange={(e) => setGroup(e.target.value)} options={[{ value: 'GENERAL', label: 'General' }, { value: 'TECHNICAL', label: 'Technical' }]} />
        <Button type="button" size="sm" onClick={addSpec}>Add</Button>
      </div>

      <div className="flex flex-col gap-2">
        {specifications.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span>{s.label}: {s.value} ({s.group})</span>
            <button type="button" onClick={() => removeSpec(i)} className="text-danger-500">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}