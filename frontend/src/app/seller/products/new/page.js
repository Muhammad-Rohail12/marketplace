'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductBasicInfoForm from '@/components/seller/products/ProductBasicInfoForm';
import ProductCategoryBrandForm from '@/components/seller/products/ProductCategoryBrandForm';
import { productService } from '@/services/productService';
import { ROLES } from '@/constants/roles';

const INITIAL = {
  name: '', shortDescription: '', description: '', productType: 'SIMPLE', condition: 'NEW',
  sku: '', barcode: '', modelNumber: '', manufacturer: '', countryOfOrigin: '', warrantyInformation: '',
  categoryId: '', brandId: '',
};

function NewProductContent() {
  const router = useRouter();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCreate = async () => {
    setServerError('');
    if (!values.name.trim() || !values.categoryId) {
      setErrors({ name: !values.name.trim() ? 'Name is required' : undefined, categoryId: !values.categoryId ? 'Category is required' : undefined });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await productService.create(values);
      router.push(`/seller/products/${res.data.product.id}/edit`);
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || 'Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New Product</h1>
      <Card className="flex flex-col gap-6">
        <ProductBasicInfoForm values={values} onChange={handleChange} errors={errors} />
        <ProductCategoryBrandForm values={values} onChange={handleChange} errors={errors} />
        {serverError && <p className="text-sm text-danger-600">{serverError}</p>}
        <Button type="button" onClick={handleCreate} isLoading={isSubmitting} className="self-start">
          Create Draft & Continue
        </Button>
      </Card>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <NewProductContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}