'use client';

import { useEffect, useState } from 'react';
import BrandCarousel from './BrandCarousel';
import { getFeaturedBrands } from '@/services/brandService';

// Ready-to-drop-in homepage section — not mounted on any page yet
// since the marketplace homepage itself is a future phase.
export default function FeaturedBrandSection() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getFeaturedBrands()
      .then((res) => setBrands(res.data.brands))
      .catch(() => setBrands([]));
  }, []);

  if (!brands.length) return null;

  return <BrandCarousel brands={brands} title="Top Brands" />;
}