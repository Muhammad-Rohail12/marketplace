'use client';

import { resolveImageSrc } from '@/utils/imageHelpers';

function ImageField({ label, name, currentUrl, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveImageSrc(currentUrl)} alt={label} className="h-16 w-16 rounded object-cover" />
      )}
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        className="text-sm"
      />
    </div>
  );
}

export default function CategoryImageFields({ category, files, onFileChange }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ImageField label="Icon" name="icon" currentUrl={files.icon ? null : category?.icon} onChange={onFileChange} />
      <ImageField label="Image" name="image" currentUrl={files.image ? null : category?.image} onChange={onFileChange} />
      <ImageField label="Banner" name="banner" currentUrl={files.banner ? null : category?.banner} onChange={onFileChange} />
    </div>
  );
}