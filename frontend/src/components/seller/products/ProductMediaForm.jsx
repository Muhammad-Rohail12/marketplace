'use client';

import { useEffect, useState, useCallback } from 'react';
import MediaUploadDropzone from './media/MediaUploadDropzone';
import ProductMediaGrid from './media/ProductMediaGrid';
import { mediaService } from '@/services/mediaService';

export default function ProductMediaForm({ productId }) {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await mediaService.list(productId);
    setMedia(res.data.media);
    setIsLoading(false);
  }, [productId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleFilesSelected = async (fileList) => {
    setError('');
    setIsUploading(true);
    try {
      await mediaService.upload(productId, fileList);
      load();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (mediaId) => {
    await mediaService.setPrimary(productId, mediaId);
    load();
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Delete this image?')) return;
    await mediaService.delete(productId, mediaId);
    load();
  };

  const handleSaveMetadata = async (mediaId, data) => {
    await mediaService.updateMetadata(productId, mediaId, data);
    load();
  };

  const handleReplace = async (mediaId, file) => {
    setError('');
    try {
      await mediaService.replace(productId, mediaId, file);
      load();
    } catch (err) {
      setError(err.message || 'Replace failed');
    }
  };

  const handleReorder = async (orderedIds) => {
    await mediaService.reorder(productId, orderedIds);
  };

  if (isLoading) return <p className="text-sm text-gray-500">Loading media...</p>;

  return (
    <div className="flex flex-col gap-4">
      <MediaUploadDropzone onFilesSelected={handleFilesSelected} isUploading={isUploading} />
      {error && <p className="text-sm text-danger-600">{error}</p>}
      {media.length > 0 ? (
        <ProductMediaGrid
          media={media}
          onSetPrimary={handleSetPrimary}
          onDelete={handleDelete}
          onSaveMetadata={handleSaveMetadata}
          onReplace={handleReplace}
          onReorder={handleReorder}
        />
      ) : (
        <p className="text-sm text-gray-500">No images uploaded yet.</p>
      )}
    </div>
  );
}