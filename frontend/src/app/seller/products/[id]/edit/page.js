'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ProductBasicInfoForm from '@/components/seller/products/ProductBasicInfoForm';
import ProductCategoryBrandForm from '@/components/seller/products/ProductCategoryBrandForm';
import ProductAttributesForm from '@/components/seller/products/ProductAttributesForm';
import ProductVariantsForm from '@/components/seller/products/ProductVariantsForm';
import ProductSpecificationsForm from '@/components/seller/products/ProductSpecificationsForm';
import ProductMediaForm from '@/components/seller/products/ProductMediaForm';
import ProductSeoForm from '@/components/seller/products/ProductSeoForm';
import ProductReviewPanel from '@/components/seller/products/ProductReviewPanel';
import { productService } from '@/services/productService';
import { ROLES } from '@/constants/roles';

const TABS = ['Basic Info', 'Category & Brand', 'Attributes', 'Variants', 'Media', 'Specifications', 'SEO', 'Review'];

function EditProductContent() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [values, setValues] = useState(null);
  const [attrValues, setAttrValues] = useState({});
  const [specs, setSpecs] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await productService.getMine(id);
      const p = res.data.product;
      setProduct(p);
      setValues({
        name: p.name, shortDescription: p.shortDescription || '', description: p.description || '',
        productType: p.productType, condition: p.condition, sku: p.sku || '', barcode: p.barcode || '',
        modelNumber: p.modelNumber || '', manufacturer: p.manufacturer || '', countryOfOrigin: p.countryOfOrigin || '',
        warrantyInformation: p.warrantyInformation || '', categoryId: String(p.categoryId), brandId: p.brandId ? String(p.brandId) : '',
        seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '', seoKeywords: p.seoKeywords || '',
      });
      setSpecs(p.specifications.map((s) => ({ label: s.label, value: s.value, group: s.group, displayOrder: s.displayOrder })));
    } catch (err) {
      setLoadError(err.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleChange = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSaveBasic = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await productService.update(id, values);
      setMessage('Saved');
      load();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAttributes = async () => {
    setIsSaving(true);
    const list = Object.entries(attrValues).map(([attributeId, v]) => ({ attributeId: Number(attributeId), ...v }));
    await productService.updateAttributes(id, list);
    setMessage('Attributes saved');
    setIsSaving(false);
    load();
  };

  const handleSaveSpecs = async () => {
    setIsSaving(true);
    await productService.updateSpecifications(id, specs);
    setMessage('Specifications saved');
    setIsSaving(false);
    load();
  };

  const handleSaveSeo = async () => {
    setIsSaving(true);
    await productService.update(id, { seoTitle: values.seoTitle, seoDescription: values.seoDescription, seoKeywords: values.seoKeywords });
    setMessage('SEO saved');
    setIsSaving(false);
    load();
  };

  const handleSubmit = async () => {
    await productService.submit(id);
    load();
  };

  const handleArchive = async () => {
    if (!window.confirm('Archive this product?')) return;
    await productService.archive(id);
    load();
  };

  if (isLoading) return <PageLoader label="Loading product..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-2">
          {product.status === 'DRAFT' && <Button size="sm" onClick={handleSubmit}>Submit for Review</Button>}
          {['DRAFT', 'ACTIVE', 'INACTIVE'].includes(product.status) && (
            <Button size="sm" variant="danger" onClick={handleArchive}>Archive</Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {message && <SuccessMessage message={message} />}

      <Card>
        {activeTab === 'Basic Info' && (
          <div className="flex flex-col gap-4">
            <ProductBasicInfoForm values={values} onChange={handleChange} />
            <Button size="sm" onClick={handleSaveBasic} isLoading={isSaving} className="self-start">Save</Button>
          </div>
        )}
        {activeTab === 'Category & Brand' && (
          <div className="flex flex-col gap-4">
            <ProductCategoryBrandForm values={values} onChange={handleChange} />
            <Button size="sm" onClick={handleSaveBasic} isLoading={isSaving} className="self-start">Save</Button>
          </div>
        )}
        {activeTab === 'Attributes' && (
          <div className="flex flex-col gap-4">
            <ProductAttributesForm categoryId={values.categoryId} values={attrValues} onChange={(attrId, v) => setAttrValues((prev) => ({ ...prev, [attrId]: v }))} />
            <Button size="sm" onClick={handleSaveAttributes} isLoading={isSaving} className="self-start">Save Attributes</Button>
          </div>
        )}
        {activeTab === 'Variants' && (
          <ProductVariantsForm productId={Number(id)} productType={values.productType} variants={product.variants} onChanged={load} />
        )}
        {activeTab === 'Media' && <ProductMediaForm productId={Number(id)} />}
        {activeTab === 'Specifications' && (
          <div className="flex flex-col gap-4">
            <ProductSpecificationsForm specifications={specs} onChange={setSpecs} />
            <Button size="sm" onClick={handleSaveSpecs} isLoading={isSaving} className="self-start">Save Specifications</Button>
          </div>
        )}
        {activeTab === 'SEO' && (
          <div className="flex flex-col gap-4">
            <ProductSeoForm values={values} onChange={handleChange} />
            <Button size="sm" onClick={handleSaveSeo} isLoading={isSaving} className="self-start">Save SEO</Button>
          </div>
        )}
        {activeTab === 'Review' && <ProductReviewPanel product={product} />}
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <EditProductContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}