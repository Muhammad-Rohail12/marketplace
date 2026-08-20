// Mirrors tailwind.config.js — a JS-readable copy so components that
// need programmatic access to the scale (e.g. Rating star sizing,
// Carousel breakpoints) don't hardcode magic numbers independently.
export const BREAKPOINTS = { xs: 375, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1440, '3xl': 1920 };

export const SPACING_SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

export const RADIUS_SCALE = { sm: '0.375rem', md: '0.625rem', lg: '0.875rem', xl: '1.125rem', '2xl': '1.5rem' };