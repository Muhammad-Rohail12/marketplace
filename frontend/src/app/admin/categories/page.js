'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import AdminCategoryTree from '@/components/admin/categories/AdminCategoryTree';
import CategoryFormModal from '@/components/admin/categories/CategoryFormModal';
import { getCategoryTree, listCategories, deleteCategory, restoreCategory } from '@/services/categoryService';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLES } from '@/constants/roles';

function AdminCategoriesContent() {
  const [tree, setTree] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [editingCategory, setEditingCategory] = useState(null);
  const formModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    const [treeResult, listResult] = await Promise.allSettled([
      getCategoryTree({ includeInactive: 'true' }),
      listCategories({ includeInactive: 'true', includeDeleted: 'true', limit: 100 }),
    ]);

    if (treeResult.status === 'fulfilled') {
      setTree(treeResult.value.data.tree);
    } else {
      console.error('Failed to load category tree:', treeResult.reason);
      setLoadError(treeResult.reason?.message || 'Failed to load category tree');
    }

    if (listResult.status === 'fulfilled') {
      setFlatCategories(listResult.value.data.categories);
    } else {
      console.error('Failed to load category list:', listResult.reason);
      setLoadError((prev) => prev || listResult.reason?.message || 'Failed to load category list');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setEditingCategory(null);
    formModal.open();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    formModal.open();
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? Subcategories will be deleted too.`)) return;
    await deleteCategory(category.id);
    loadData();
  };

  const handleRestore = async (category) => {
    await restoreCategory(category.id);
    loadData();
  };

  const filteredTree = debouncedSearch ? tree : tree;

  if (isLoading) return <PageLoader label="Loading categories..." />;

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <ErrorState message={loadError} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <Button onClick={handleCreate}>+ New Category</Button>
      </div>

      <Card>
        <Input
          id="category-search"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card>
        {filteredTree.length === 0 ? (
          <EmptyState title="No categories yet" message="Create your first category to get started." />
        ) : (
          <AdminCategoryTree tree={filteredTree} onEdit={handleEdit} onDelete={handleDelete} onRestore={handleRestore} />
        )}
      </Card>

      <CategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        category={editingCategory}
        flatCategories={flatCategories}
        onSaved={loadData}
      />
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminCategoriesContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}