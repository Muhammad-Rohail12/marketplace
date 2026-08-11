'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

const TYPE_OPTIONS = ['SIMPLE', 'VARIABLE', 'BUNDLE'].map((v) => ({ value: v, label: v }));
const CONDITION_OPTIONS = ['NEW', 'USED', 'REFURBISHED'].map((v) => ({ value: v, label: v }));

export default function ProductBasicInfoForm({ values, onChange, errors = {} }) {
  const handle = (e) => onChange(e.target.name, e.target.value);

  return (
    <div className="flex flex-col gap-4">
      <Input id="name" label="Product name" value={values.name} onChange={(e) => onChange('name', e.target.value)} error={errors.name} />
      <Input id="shortDescription" label="Short description" value={values.shortDescription} onChange={(e) => onChange('shortDescription', e.target.value)} error={errors.shortDescription} />
      <Textarea id="description" label="Full description" value={values.description} onChange={(e) => onChange('description', e.target.value)} error={errors.description} rows={6} />

      <div className="grid grid-cols-2 gap-4">
        <Select id="productType" label="Product type" value={values.productType} onChange={handle} name="productType" options={TYPE_OPTIONS} />
        <Select id="condition" label="Condition" value={values.condition} onChange={handle} name="condition" options={CONDITION_OPTIONS} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="sku" label="SKU (optional)" value={values.sku} onChange={(e) => onChange('sku', e.target.value)} error={errors.sku} />
        <Input id="barcode" label="Barcode (optional)" value={values.barcode} onChange={(e) => onChange('barcode', e.target.value)} error={errors.barcode} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="modelNumber" label="Model number" value={values.modelNumber} onChange={(e) => onChange('modelNumber', e.target.value)} />
        <Input id="manufacturer" label="Manufacturer" value={values.manufacturer} onChange={(e) => onChange('manufacturer', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="countryOfOrigin" label="Country of origin" value={values.countryOfOrigin} onChange={(e) => onChange('countryOfOrigin', e.target.value)} />
        <Input id="warrantyInformation" label="Warranty" value={values.warrantyInformation} onChange={(e) => onChange('warrantyInformation', e.target.value)} />
      </div>
    </div>
  );
}