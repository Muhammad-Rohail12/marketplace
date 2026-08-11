'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import CategoryImageFields from './CategoryImageFields';
import { createCategory, updateCategory } from '@/services/categoryService';

export default function CategoryFormModal({ isOpen, onClose, category, flatCategories, onSaved }) {
  const isEdit = !!category;

  const [values, setValues] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parentId: category?.parentId ?? '',
    sortOrder: category?.sortOrder ?? 0,
    seoTitle: category?.seoTitle || '',
    seoDescription: category?.seoDescription || '',
    seoKeywords: category?.seoKeywords || '',
    isActive: category?.isActive ?? true,
    isFeatured: category?.isFeatured ?? false,
    showOnHomepage: category?.showOnHomepage ?? false,
    showInNavigation: category?.showInNavigation ?? true,
  });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parentOptions = [
    { value: '', label: '— No parent (top-level) —' },
    ...flatCategories
      .filter((c) => !isEdit || c.id !== category.id) // can't be its own parent
      .map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('parentId', values.parentId === '' ? 'null' : values.parentId);
    formData.append('sortOrder', values.sortOrder);
    formData.append('seoTitle', values.seoTitle);
    formData.append('seoDescription', values.seoDescription);
    formData.append('seoKeywords', values.seoKeywords);
    formData.append('isActive', values.isActive);
    formData.append('isFeatured', values.isFeatured);
    formData.append('showOnHomepage', values.showOnHomepage);
    formData.append('showInNavigation', values.showInNavigation);
    Object.entries(files).forEach(([key, file]) => file && formData.append(key, file));

    try {
      if (isEdit) {
        await updateCategory(category.id, formData);
      } else {
        await createCategory(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err.statusCode === 422 && err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Category' : 'Create Category'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
        <Input id="name" name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} />

        <Textarea
          id="description"
          name="description"
          label="Description"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="parentId"
            name="parentId"
            label="Parent category"
            value={values.parentId}
            onChange={handleChange}
            options={parentOptions}
          />
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            label="Sort order"
            value={values.sortOrder}
            onChange={handleChange}
            error={errors.sortOrder}
          />
        </div>

        <CategoryImageFields category={category} files={files} onFileChange={handleFileChange} />

        <div className="grid grid-cols-2 gap-4">
          <Checkbox id="isActive" name="isActive" label="Active" checked={values.isActive} onChange={handleChange} />
          <Checkbox id="isFeatured" name="isFeatured" label="Featured" checked={values.isFeatured} onChange={handleChange} />
          <Checkbox
            id="showOnHomepage"
            name="showOnHomepage"
            label="Show on homepage"
            checked={values.showOnHomepage}
            onChange={handleChange}
          />
          <Checkbox
            id="showInNavigation"
            name="showInNavigation"
            label="Show in navigation"
            checked={values.showInNavigation}
            onChange={handleChange}
          />
        </div>

        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-600">SEO settings</summary>
          <div className="mt-3 flex flex-col gap-3">
            <Input id="seoTitle" name="seoTitle" label="SEO title" value={values.seoTitle} onChange={handleChange} error={errors.seoTitle} />
            <Textarea
              id="seoDescription"
              name="seoDescription"
              label="SEO description"
              value={values.seoDescription}
              onChange={handleChange}
              error={errors.seoDescription}
            />
            <Input
              id="seoKeywords"
              name="seoKeywords"
              label="SEO keywords"
              value={values.seoKeywords}
              onChange={handleChange}
              error={errors.seoKeywords}
            />
          </div>
        </details>

        {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}

        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}