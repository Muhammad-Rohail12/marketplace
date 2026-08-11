'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function ProductSeoForm({ values, onChange, errors = {} }) {
  return (
    <div className="flex flex-col gap-4">
      <Input id="seoTitle" label="SEO title" value={values.seoTitle} onChange={(e) => onChange('seoTitle', e.target.value)} error={errors.seoTitle} />
      <Textarea id="seoDescription" label="SEO description" value={values.seoDescription} onChange={(e) => onChange('seoDescription', e.target.value)} error={errors.seoDescription} />
      <Input id="seoKeywords" label="SEO keywords" value={values.seoKeywords} onChange={(e) => onChange('seoKeywords', e.target.value)} error={errors.seoKeywords} />
    </div>
  );
}