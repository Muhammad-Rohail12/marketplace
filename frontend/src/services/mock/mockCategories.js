export const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics', icon: null },
  { id: 2, name: 'Beauty', slug: 'beauty', icon: null },
  { id: 3, name: 'Sports', slug: 'sports', icon: null },
  { id: 4, name: 'Kitchen', slug: 'kitchen', icon: null },
  { id: 5, name: 'Home Decor', slug: 'home-decor', icon: null },
  { id: 6, name: 'Watches', slug: 'watches', icon: null },
];

export const getMockCategories = () => Promise.resolve({ data: { categories: MOCK_CATEGORIES } });