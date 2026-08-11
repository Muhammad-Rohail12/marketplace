'use client';

import { useEffect, useState } from 'react';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { pimService } from '@/services/pimService';

export default function VariantsTab({ attributes }) {
  const [options, setOptions] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [attributeId, setAttributeId] = useState('');
  const [values, setValues] = useState([]);
  const [attributeValueId, setAttributeValueId] = useState('');
  const [comboName, setComboName] = useState('');
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);

  const variantAttributes = attributes.filter((a) => a.isVariantAttribute);

  const loadOptions = async () => {
    const res = await pimService.listVariantOptions();
    setOptions(res.data.options);
  };
  const loadCombinations = async () => {
    const res = await pimService.listVariantCombinations({ limit: 50 });
    setCombinations(res.data.combinations);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadOptions(); loadCombinations(); }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!attributeId) { setValues([]); return; }
    pimService.listAttributeValues(attributeId).then((res) => setValues(res.data.values));
  }, [attributeId]);

  const handleAddOption = async () => {
    if (!attributeId || !attributeValueId) return;
    await pimService.createVariantOption({ attributeId: Number(attributeId), attributeValueId: Number(attributeValueId) });
    loadOptions();
  };

  const toggleOption = (id) => {
    setSelectedOptionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreateCombination = async () => {
    if (!comboName.trim() || selectedOptionIds.length === 0) return;
    await pimService.createVariantCombination({ name: comboName.trim(), variantOptionIds: selectedOptionIds });
    setComboName('');
    setSelectedOptionIds([]);
    loadCombinations();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Variant Options</h3>
        <div className="flex gap-2">
          <Select
            value={attributeId}
            onChange={(e) => setAttributeId(e.target.value)}
            options={[{ value: '', label: 'Select attribute...' }, ...variantAttributes.map((a) => ({ value: String(a.id), label: a.name }))]}
          />
          <Select
            value={attributeValueId}
            onChange={(e) => setAttributeValueId(e.target.value)}
            options={[{ value: '', label: 'Select value...' }, ...values.map((v) => ({ value: String(v.id), label: v.label }))]}
          />
          <Button type="button" onClick={handleAddOption}>Add Option</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <span key={o.id} className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              {o.attribute?.name}: {o.attributeValue?.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Variant Combinations</h3>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggleOption(o.id)}
              className={`rounded-full border px-2 py-1 text-xs ${selectedOptionIds.includes(o.id) ? 'border-primary-600 bg-primary-50' : 'border-gray-300 dark:border-gray-700'}`}
            >
              {o.attribute?.name}: {o.attributeValue?.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input placeholder="Combination name (e.g. Red / Large)" value={comboName} onChange={(e) => setComboName(e.target.value)} />
          <Button type="button" onClick={handleCreateCombination}>Create Combination</Button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {combinations.map((c) => (
            <Card key={c.id} className="text-sm">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">
                {c.options.map((o) => `${o.variantOption.attribute.name}: ${o.variantOption.attributeValue.label}`).join(', ')}
              </p>
            </Card>
          ))}
          {combinations.length === 0 && <p className="text-sm text-gray-500">No combinations yet.</p>}
        </div>
      </div>
    </div>
  );
}