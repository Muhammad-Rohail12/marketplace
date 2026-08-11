'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { pimService } from '@/services/pimService';

const UNIT_TYPE_OPTIONS = ['WEIGHT', 'DIMENSION', 'VOLUME', 'COUNT'].map((t) => ({ value: t, label: t }));

export default function MeasurementUnitsTab() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', unitType: 'WEIGHT' });
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const res = await pimService.listMeasurementUnits();
    setUnits(res.data.units);
    setIsLoading(false);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    await pimService.createMeasurementUnit(form);
    setForm({ name: '', code: '', unitType: 'WEIGHT' });
    load();
  };

  const handleDelete = async (id) => {
    await pimService.deleteMeasurementUnit(id);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="grid grid-cols-3 gap-3">
        <Input placeholder="Name (Kilogram)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Code (KG)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <Select value={form.unitType} onChange={(e) => setForm({ ...form, unitType: e.target.value })} options={UNIT_TYPE_OPTIONS} />
        <Button type="submit" className="col-span-full">Add Unit</Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {units.map((u) => (
            <Card key={u.id} className="flex items-center justify-between">
              <span className="text-sm">{u.name} ({u.code}) — {u.unitType}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>×</Button>
            </Card>
          ))}
          {units.length === 0 && <p className="text-sm text-gray-500">No units yet.</p>}
        </div>
      )}
    </div>
  );
}