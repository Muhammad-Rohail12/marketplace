'use client';

import { useState } from 'react';
import { resolveImageSrc } from '@/utils/imageHelpers';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProductMediaItem({ media, onSetPrimary, onDelete, onSaveMetadata, onReplace, dragHandleProps }) {
  const [altText, setAltText] = useState(media.altText || '');
  const [title, setTitle] = useState(media.title || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveMetadata(media.id, { altText, title });
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800" {...dragHandleProps}>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resolveImageSrc(media.url)} alt={media.altText || ''} className="aspect-square w-full rounded-md object-cover" />
        {media.isPrimary && (
          <span className="absolute left-1 top-1">
            <Badge variant="primary">Primary</Badge>
          </span>
        )}
      </div>

      <p className="truncate text-xs text-gray-500">{media.originalFileName}</p>
      <p className="text-xs text-gray-400">{(media.fileSize / 1024).toFixed(0)} KB · {media.width}×{media.height}</p>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <Input id={`alt-${media.id}`} placeholder="Alt text" value={altText} onChange={(e) => setAltText(e.target.value)} />
          <Input id={`title-${media.id}`} placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {!media.isPrimary && (
            <Button size="sm" variant="ghost" onClick={() => onSetPrimary(media.id)}>Set Primary</Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
          <label className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            Replace
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onReplace(media.id, e.target.files[0])}
            />
          </label>
          <Button size="sm" variant="ghost" onClick={() => onDelete(media.id)}>Delete</Button>
        </div>
      )}
    </div>
  );
}