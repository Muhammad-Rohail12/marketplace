'use client';

import { useEffect, useState } from 'react';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { pimService } from '@/services/pimService';
import { productService } from '@/services/productService';

export default function ProductVariantsForm({ productId, productType, variants = [], onChanged }) {
  const [attributes, setAttributes] = useState([]);
  const [options, setOptions] = useState([]);
  const [attributeId, setAttributeId] = useState('');
  const [values, setValues] = useState([]);
  const [attributeValueId, setAttributeValueId] = useState('');
  const [comboName, setComboName] = useState('');
  const [comboSku, setComboSku] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);

  useEffect(() => {
    pimService.listAttributes({ limit: 100 }).then((res) => setAttributes(res.data.attributes.filter((a) => a.isVariantAttribute)));
    pimService.listVariantOptions().then((res) => setOptions(res.data.options));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!attributeId) { setValues([]); return; }
    pimService.listAttributeValues(attributeId).then((res) => setValues(res.data.values));
  }, [attributeId]);

  if (productType !== 'VARIABLE') {
    return <p className="text-sm text-gray-500">Variants are only available for VARIABLE product type. Change the product type in Basic Info to enable variants.</p>;
  }
  if (!productId) {
    return <p className="text-sm text-gray-500">Save the product first (as a draft) to start adding variants.</p>;
  }

  const handleAddOption = async () => {
    if (!attributeId || !attributeValueId) return;
    await pimService.createVariantOption({ attributeId: Number(attributeId), attributeValueId: Number(attributeValueId) });
    const res = await pimService.listVariantOptions();
    setOptions(res.data.options);
  };

  const toggleOption = (id) => setSelectedOptionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleCreateCombination = async () => {
    if (!comboName.trim() || selectedOptionIds.length === 0) return;
    await productService.createVariant(productId, {
      name: comboName.trim(),
      sku: comboSku.trim() || undefined,
      price: comboPrice || undefined,
      variantOptionIds: selectedOptionIds,
    });
    setComboName(''); setComboSku(''); setComboPrice(''); setSelectedOptionIds([]);
    onChanged();
  };

  const handleDelete = async (variantId) => {
    await productService.deleteVariant(productId, variantId);
    onChanged();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Variant Options</h3>
        <div className="flex gap-2">
          <Select value={attributeId} onChange={(e) => setAttributeId(e.target.value)} options={[{ value: '', label: 'Attribute...' }, ...attributes.map((a) => ({ value: String(a.id), label: a.name }))]} />
          <Select value={attributeValueId} onChange={(e) => setAttributeValueId(e.target.value)} options={[{ value: '', label: 'Value...' }, ...values.map((v) => ({ value: String(v.id), label: v.label }))]} />
          <Button type="button" size="sm" onClick={handleAddOption}>Add Option</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((o) => (
            <button key={o.id} type="button" onClick={() => toggleOption(o.id)}
              className={`rounded-full border px-2 py-1 text-xs ${selectedOptionIds.includes(o.id) ? 'border-primary-600 bg-primary-50' : 'border-gray-300 dark:border-gray-700'}`}>
              {o.attribute?.name}: {o.attributeValue?.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Create Combination</h3>
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Name (e.g. Red / Large)" value={comboName} onChange={(e) => setComboName(e.target.value)} />
          <Input placeholder="SKU (optional)" value={comboSku} onChange={(e) => setComboSku(e.target.value)} />
          <Input placeholder="Price (optional)" type="number" value={comboPrice} onChange={(e) => setComboPrice(e.target.value)} />
        </div>
        <Button type="button" size="sm" className="mt-2" onClick={handleCreateCombination}>Create Combination</Button>
      </div>

      <div className="flex flex-col gap-2">
        {variants.map((v) => (
          <Card key={v.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{v.name}</p>
              <p className="text-xs text-gray-500">
                {v.options.map((o) => `${o.variantOption.attribute.name}: ${o.variantOption.attributeValue.label}`).join(', ')}
                {v.sku && ` • SKU: ${v.sku}`}
                {v.price && ` • $${v.price}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)}>Remove</Button>
          </Card>
        ))}
        {variants.length === 0 && <p className="text-sm text-gray-500">No variants yet.</p>}
      </div>
    </div>
  );
}