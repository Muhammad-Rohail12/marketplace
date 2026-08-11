'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { createBrand, updateBrand } from '@/services/brandService';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function BrandFormModal({ isOpen, onClose, brand, onSaved }) {
  const isEdit = !!brand;

  const [values, setValues] = useState({
    name: brand?.name || '',
    shortDescription: brand?.shortDescription || '',
    description: brand?.description || '',
    websiteUrl: brand?.websiteUrl || '',
    country: brand?.country || '',
    displayOrder: brand?.displayOrder ?? 0,
    status: brand?.status || 'ACTIVE',
    seoTitle: brand?.seoTitle || '',
    seoDescription: brand?.seoDescription || '',
    seoKeywords: brand?.seoKeywords || '',
    isVerified: brand?.isVerified ?? false,
    isFeatured: brand?.isFeatured ?? false,
    showOnHomepage: brand?.showOnHomepage ?? false,
  });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
    Object.entries(files).forEach(([key, file]) => file && formData.append(key, file));

    try {
      if (isEdit) {
        await updateBrand(brand.id, formData);
      } else {
        await createBrand(formData);
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Brand' : 'Create Brand'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
        <Input id="name" name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} />

        <Input
          id="shortDescription"
          name="shortDescription"
          label="Short description"
          value={values.shortDescription}
          onChange={handleChange}
          error={errors.shortDescription}
        />

        <Textarea
          id="description"
          name="description"
          label="Description"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="websiteUrl"
            name="websiteUrl"
            label="Website URL"
            placeholder="https://..."
            value={values.websiteUrl}
            onChange={handleChange}
            error={errors.websiteUrl}
          />
          <Input id="country" name="country" label="Country" value={values.country} onChange={handleChange} error={errors.country} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="displayOrder"
            name="displayOrder"
            type="number"
            label="Display order"
            value={values.displayOrder}
            onChange={handleChange}
            error={errors.displayOrder}
          />
          <Select id="status" name="status" label="Status" value={values.status} onChange={handleChange} options={STATUS_OPTIONS} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
            {brand?.logo && !files.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveImageSrc(brand.logo)} alt="Logo" className="h-16 w-16 rounded object-contain" />
            )}
            <input type="file" name="logo" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner</label>
            {brand?.banner && !files.banner && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveImageSrc(brand.banner)} alt="Banner" className="h-16 w-28 rounded object-cover" />
            )}
            <input type="file" name="banner" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Checkbox id="isVerified" name="isVerified" label="Verified" checked={values.isVerified} onChange={handleChange} />
          <Checkbox id="isFeatured" name="isFeatured" label="Featured" checked={values.isFeatured} onChange={handleChange} />
          <Checkbox
            id="showOnHomepage"
            name="showOnHomepage"
            label="Show on homepage"
            checked={values.showOnHomepage}
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
            {isEdit ? 'Save changes' : 'Create brand'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}