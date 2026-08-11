'use client';

import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { getCategoryBreadcrumb } from '@/services/categoryService';
import { ROUTES } from '@/constants/routes';

export default function CategoryBreadcrumb({ categoryId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    getCategoryBreadcrumb(categoryId)
      .then((res) => {
        const chain = res.data.breadcrumb.map((c) => ({ label: c.name, href: `/categories/${c.slug}` }));
        setItems([{ label: 'Home', href: ROUTES.HOME }, ...chain]);
      })
      .catch(() => setItems([]));
  }, [categoryId]);

  if (!items.length) return null;

  return <Breadcrumb items={items.map((item, i) => (i === items.length - 1 ? { label: item.label } : item))} />;
}