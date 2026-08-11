'use client';

import { useRef, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { uploadProfileImage, removeProfileImage } from '@/services/userService';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { FILE_UPLOAD } from '@/constants/fileUpload';

export default function ProfileImageUpload({ user, onUpdated }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WEBP images are allowed');
      return;
    }
    if (file.size > FILE_UPLOAD.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${FILE_UPLOAD.MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadProfileImage(file);
      onUpdated(res.data.user);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async () => {
    setError('');
    setIsUploading(true);
    try {
      const res = await removeProfileImage();
      onUpdated(res.data.user);
    } catch (err) {
      setError(err.message || 'Could not remove image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar
        name={`${user.firstName} ${user.lastName}`}
        src={user.profileImage ? resolveImageSrc(user.profileImage) : undefined}
        size={72}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {user.profileImage ? 'Change photo' : 'Upload photo'}
          </Button>
          {user.profileImage && (
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={isUploading}>
              Remove
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-danger-500">{error}</p>}
        <p className="text-xs text-gray-500">JPEG, PNG, or WEBP. Max {FILE_UPLOAD.MAX_IMAGE_SIZE_MB}MB.</p>
      </div>
    </div>
  );
}