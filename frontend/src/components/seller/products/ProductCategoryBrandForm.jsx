'use client';

import { useEffect, useState } from 'react';
import Select from '@/components/ui/Select';
import { listCategories } from '@/services/categoryService';
import { listBrands } from '@/services/brandService';

export default function ProductCategoryBrandForm({ values, onChange, errors = {} }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    listCategories({ limit: 200 }).then((res) => setCategories(res.data.categories));
    listBrands({ limit: 200 }).then((res) => setBrands(res.data.brands));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Select
        id="categoryId"
        label="Category"
        value={values.categoryId || ''}
        onChange={(e) => onChange('categoryId', e.target.value)}
        error={errors.categoryId}
        options={[{ value: '', label: 'Select a category...' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]}
      />
      <Select
        id="brandId"
        label="Brand (optional)"
        value={values.brandId || ''}
        onChange={(e) => onChange('brandId', e.target.value)}
        options={[{ value: '', label: '— No brand / private label —' }, ...brands.map((b) => ({ value: String(b.id), label: b.name }))]}
      />
    </div>
  );
}