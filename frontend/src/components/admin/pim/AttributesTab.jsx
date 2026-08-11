'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { pimService } from '@/services/pimService';

const TYPE_OPTIONS = [
  'TEXT', 'NUMBER', 'DECIMAL', 'BOOLEAN', 'COLOR', 'SIZE',
  'DROPDOWN', 'MULTISELECT', 'DATE', 'MEASUREMENT', 'URL', 'RICH_TEXT', 'IMAGE_REFERENCE',
].map((t) => ({ value: t, label: t }));

function AttributeValuesEditor({ attribute, onChange }) {
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  const load = async () => {
    const res = await pimService.listAttributeValues(attribute.id);
    setValues(res.data.values);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [attribute.id]);

  const addValue = async () => {
    if (!newValue.trim()) return;
    await pimService.createAttributeValue(attribute.id, {
      value: newValue.trim(),
      label: newValue.trim(),
      ...(attribute.type === 'COLOR' ? { colorHex: newColor } : {}),
    });
    setNewValue('');
    load();
    onChange?.();
  };

  const removeValue = async (id) => {
    await pimService.deleteAttributeValue(id);
    load();
    onChange?.();
  };

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v.id} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
            {attribute.type === 'COLOR' && v.colorHex && (
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: v.colorHex }} />
            )}
            {v.label}
            <button type="button" onClick={() => removeValue(v.id)} className="text-danger-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Add value..."
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-transparent"
        />
        {attribute.type === 'COLOR' && (
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="h-8 w-8" />
        )}
        <Button type="button" size="sm" onClick={addValue}>Add</Button>
      </div>
    </div>
  );
}

export default function AttributesTab({ groups }) {
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'TEXT', groupId: '', isVariantAttribute: false, isFilterable: false, isRequired: false });

  const load = async () => {
    setIsLoading(true);
    const res = await pimService.listAttributes({ limit: 100 });
    setAttributes(res.data.attributes);
    setIsLoading(false);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await pimService.createAttribute({ ...form, groupId: form.groupId || null });
    setForm({ name: '', type: 'TEXT', groupId: '', isVariantAttribute: false, isFilterable: false, isRequired: false });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attribute?')) return;
    await pimService.deleteAttribute(id);
    load();
  };

  const needsValues = (type) => ['COLOR', 'SIZE', 'DROPDOWN', 'MULTISELECT'].includes(type);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Input id="attr-name" name="name" placeholder="Attribute name" value={form.name} onChange={handleChange} />
        <Select id="attr-type" name="type" value={form.type} onChange={handleChange} options={TYPE_OPTIONS} />
        <Select
          id="attr-group"
          name="groupId"
          value={form.groupId}
          onChange={handleChange}
          options={[{ value: '', label: '— No group —' }, ...groups.map((g) => ({ value: String(g.id), label: g.name }))]}
        />
        <Checkbox id="attr-variant" name="isVariantAttribute" label="Variant attribute" checked={form.isVariantAttribute} onChange={handleChange} />
        <Checkbox id="attr-filterable" name="isFilterable" label="Filterable" checked={form.isFilterable} onChange={handleChange} />
        <Checkbox id="attr-required" name="isRequired" label="Required" checked={form.isRequired} onChange={handleChange} />
        <Button type="submit" className="col-span-full sm:col-span-1">Add Attribute</Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {attributes.map((attr) => (
            <Card key={attr.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{attr.name} <span className="text-xs text-gray-400">({attr.code})</span></p>
                  <div className="mt-1 flex gap-1">
                    <Badge variant="neutral">{attr.type}</Badge>
                    {attr.isVariantAttribute && <Badge variant="primary">Variant</Badge>}
                    {attr.isFilterable && <Badge variant="warning">Filterable</Badge>}
                    {attr.isRequired && <Badge variant="danger">Required</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {needsValues(attr.type) && (
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}>
                      {expandedId === attr.id ? 'Hide values' : 'Manage values'}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(attr.id)}>Delete</Button>
                </div>
              </div>
              {expandedId === attr.id && <AttributeValuesEditor attribute={attr} onChange={load} />}
            </Card>
          ))}
          {attributes.length === 0 && <p className="text-sm text-gray-500">No attributes yet.</p>}
        </div>
      )}
    </div>
  );
}