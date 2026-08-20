'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import StarRatingInput from './StarRatingInput';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { reviewService } from '@/services/reviewService';

const TITLE_MAX = 100;
const BODY_MAX = 2000;
const BODY_MIN = 10;

export default function WriteReviewModal({ isOpen, onClose, productId, productName, onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...previews].slice(0, 5));
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (title.trim().length > TITLE_MAX) newErrors.title = `Title must be under ${TITLE_MAX} characters`;
    if (body.trim().length < BODY_MIN) newErrors.body = `Please write at least ${BODY_MIN} characters`;
    if (body.trim().length > BODY_MAX) newErrors.body = `Review must be under ${BODY_MAX} characters`;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.create(productId, { rating, title: title.trim() || null, body: body.trim() });
      onSubmitted?.();
      setSubmitted(true);
    } catch (error) {
      setErrors({ body: error.message || 'Could not save your review' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setRating(0); setTitle(''); setBody(''); setImages([]); setErrors({}); setSubmitted(false);
    }, 200);
  };

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Sign in required">
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Please sign in to write a review for {productName}.</p>
        <Button onClick={() => router.push(ROUTES.LOGIN)}>Sign In</Button>
      </Modal>
    );
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Thank you!">
        <SuccessMessage message="Thanks for your review. It has been saved." />
        <Button onClick={handleClose} className="mt-4">Close</Button>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Write a review for ${productName}`} className="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="mb-1 text-sm font-medium">Overall rating</p>
          <StarRatingInput value={rating} onChange={setRating} />
          {errors.rating && <p className="mt-1 text-xs text-danger-600">{errors.rating}</p>}
        </div>

        <Input id="review-title" label="Review title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />

        <Textarea id="review-body" label="Your review" rows={5} value={body} onChange={(e) => setBody(e.target.value)} error={errors.body} />

        <div>
          <p className="mb-1 text-sm font-medium">Add photos (optional)</p>
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative h-16 w-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full rounded-md object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-neutral-900 p-0.5 text-white">×</button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400 dark:border-neutral-700">
                + Add
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
              </label>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-400">Up to 5 photos, JPG/PNG.</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
        </div>
      </form>
    </Modal>
  );
}