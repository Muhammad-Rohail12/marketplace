'use client';

import { useRef, useState } from 'react';
import { cn } from '@/utils/cn';

export default function MediaUploadDropzone({ onFilesSelected, isUploading }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'
      )}
    >
      <p className="text-sm font-medium">Drag & drop images here, or click to select</p>
      <p className="text-xs text-gray-500">JPEG, PNG, or WEBP · up to 8MB each · min 400×400px</p>
      {isUploading && <p className="text-xs text-primary-600">Uploading...</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && onFilesSelected(e.target.files)}
      />
    </div>
  );
}