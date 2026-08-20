// Static hero slide content — no Banner/Promotion backend model
// exists yet (that arrives with a future admin-content-management
// phase). Editing this file is the current way to update hero
// content; a future phase can swap this for a real API call without
// any change to HeroSlider's rendering logic (same shape).
export const HERO_SLIDES = [
  {
    id: 'slide-electronics',
    eyebrow: 'New Arrivals',
    title: 'Level Up Your Tech',
    subtitle: 'Shop the latest electronics, backed by fast US shipping.',
    ctaLabel: 'Shop Electronics',
    ctaHref: '/categories/electronics',
    theme: 'from-primary-700 to-primary-900',
  },
  {
    id: 'slide-deals',
    eyebrow: 'Limited-Time Offer',
    title: 'Deals Up to 30% Off',
    subtitle: 'Hand-picked savings across top categories, updated daily.',
    ctaLabel: 'Shop Deals',
    ctaHref: '/deals',
    theme: 'from-secondary-600 to-secondary-700',
  },
  {
    id: 'slide-home',
    eyebrow: 'Refresh Your Space',
    title: 'Home & Kitchen Essentials',
    subtitle: 'Everything you need to make your house feel like home.',
    ctaLabel: 'Explore Home & Kitchen',
    ctaHref: '/categories/kitchen',
    theme: 'from-neutral-800 to-neutral-900',
  },
];