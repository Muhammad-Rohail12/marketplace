'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { pimService } from '@/services/pimService';

export default function SpecTemplatesTab() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [itemForm, setItemForm] = useState({ label: '', group: 'GENERAL' });

  const load = async () => {
    const res = await pimService.listSpecTemplates();
    setTemplates(res.data.templates);
  };
    // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await pimService.createSpecTemplate({ name: name.trim() });
    setName('');
    load();
  };

  const handleDelete = async (id) => {
    await pimService.deleteSpecTemplate(id);
    load();
  };

  const handleAddItem = async (templateId) => {
    if (!itemForm.label.trim()) return;
    await pimService.addSpecTemplateItem(templateId, itemForm);
    setItemForm({ label: '', group: 'GENERAL' });
    load();
  };

  const handleRemoveItem = async (itemId) => {
    await pimService.removeSpecTemplateItem(itemId);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input placeholder="Template name (e.g. Laptop Specs)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Add Template</Button>
      </form>

      <div className="flex flex-col gap-2">
        {templates.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.name}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                  {expandedId === t.id ? 'Hide items' : 'Manage items'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>
              </div>
            </div>
            {expandedId === t.id && (
              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                {t.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.label} ({item.group})</span>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-danger-500">×</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Item label"
                    value={itemForm.label}
                    onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                  />
                  <Select
                    value={itemForm.group}
                    onChange={(e) => setItemForm({ ...itemForm, group: e.target.value })}
                    options={[{ value: 'GENERAL', label: 'General' }, { value: 'TECHNICAL', label: 'Technical' }]}
                  />
                  <Button type="button" size="sm" onClick={() => handleAddItem(t.id)}>Add</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        {templates.length === 0 && <p className="text-sm text-gray-500">No templates yet.</p>}
      </div>
    </div>
  );
}