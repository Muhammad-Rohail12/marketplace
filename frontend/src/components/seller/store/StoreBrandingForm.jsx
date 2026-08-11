'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import StoreLogo from '@/components/store/StoreLogo';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { storeService } from '@/services/storeService';

export default function StoreBrandingForm({ store, onUpdated }) {
  const [files, setFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
  };

  const handleUpload = async () => {
    if (Object.keys(files).length === 0) return;
    setIsUploading(true);
    setError('');
    try {
      const res = await storeService.updateMedia(files);
      onUpdated(res.data.store);
      setFiles({});
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <StoreLogo store={store} size={72} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Logo</label>
          <input type="file" name="logo" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Banner</label>
        {store.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolveImageSrc(store.banner)} alt="Banner" className="h-20 w-40 rounded object-cover" />
        )}
        <input type="file" name="banner" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Icon</label>
        <input type="file" name="icon" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="text-sm" />
      </div>

      {error && <p className="text-sm text-danger-500">{error}</p>}

      <Button type="button" size="sm" onClick={handleUpload} isLoading={isUploading} disabled={Object.keys(files).length === 0}>
        Upload Images
      </Button>
    </div>
  );
}
