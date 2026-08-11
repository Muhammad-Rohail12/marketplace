'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { pimService } from '@/services/pimService';

const BARCODE_TYPES = ['EAN13', 'UPC', 'CODE128', 'ISBN'].map((t) => ({ value: t, label: t }));

export default function ConfigTab() {
  const [skuConfigs, setSkuConfigs] = useState([]);
  const [barcodeConfigs, setBarcodeConfigs] = useState([]);
  const [skuForm, setSkuForm] = useState({ name: '', pattern: '' });
  const [barcodeForm, setBarcodeForm] = useState({ name: '', type: 'EAN13', prefix: '' });

  const load = async () => {
    const [sku, barcode] = await Promise.all([pimService.listSkuConfigs(), pimService.listBarcodeConfigs()]);
    setSkuConfigs(sku.data.configs);
    setBarcodeConfigs(barcode.data.configs);
  };
// eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const addSku = async (e) => {
    e.preventDefault();
    if (!skuForm.name.trim() || !skuForm.pattern.trim()) return;
    await pimService.createSkuConfig(skuForm);
    setSkuForm({ name: '', pattern: '' });
    load();
  };

  const addBarcode = async (e) => {
    e.preventDefault();
    if (!barcodeForm.name.trim()) return;
    await pimService.createBarcodeConfig(barcodeForm);
    setBarcodeForm({ name: '', type: 'EAN13', prefix: '' });
    load();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">SKU Configuration</h3>
        <form onSubmit={addSku} className="flex flex-col gap-2">
          <Input placeholder="Name" value={skuForm.name} onChange={(e) => setSkuForm({ ...skuForm, name: e.target.value })} />
          <Input
            placeholder="Pattern (e.g. {CATEGORY}-{RANDOM})"
            value={skuForm.pattern}
            onChange={(e) => setSkuForm({ ...skuForm, pattern: e.target.value })}
          />
          <Button type="submit" size="sm">Add</Button>
        </form>
        <div className="mt-3 flex flex-col gap-2">
          {skuConfigs.map((c) => (
            <Card key={c.id} className="text-sm">{c.name}: <code>{c.pattern}</code></Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Barcode Configuration</h3>
        <form onSubmit={addBarcode} className="flex flex-col gap-2">
          <Input placeholder="Name" value={barcodeForm.name} onChange={(e) => setBarcodeForm({ ...barcodeForm, name: e.target.value })} />
          <Select value={barcodeForm.type} onChange={(e) => setBarcodeForm({ ...barcodeForm, type: e.target.value })} options={BARCODE_TYPES} />
          <Input placeholder="Prefix (optional)" value={barcodeForm.prefix} onChange={(e) => setBarcodeForm({ ...barcodeForm, prefix: e.target.value })} />
          <Button type="submit" size="sm">Add</Button>
        </form>
        <div className="mt-3 flex flex-col gap-2">
          {barcodeConfigs.map((c) => (
            <Card key={c.id} className="text-sm">{c.name} ({c.type}) {c.prefix && `— prefix: ${c.prefix}`}</Card>
          ))}
        </div>
      </div>
    </div>
  );
}