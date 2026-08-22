'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import EmptyState from '@/components/feedback/EmptyState';
import CategoryTree from '@/components/category/CategoryTree';
import { getCategoryTree } from '@/services/categoryService';

export default function CategoriesPage() {
  const [tree, setTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getCategoryTree();
      setTree(response?.data?.tree || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  return (
    <MainLayout>
      <div className="container-page py-8">
        <h1 className="mb-6 text-2xl font-semibold">Categories</h1>
        {isLoading ? <PageLoader label="Loading categories..." /> : null}
        {!isLoading && error ? <ErrorState message={error} onRetry={loadCategories} /> : null}
        {!isLoading && !error && tree.length === 0 ? (
          <EmptyState title="No categories available" message="Please check back soon." />
        ) : null}
        {!isLoading && !error && tree.length > 0 ? <CategoryTree tree={tree} /> : null}
      </div>
    </MainLayout>
  );
}