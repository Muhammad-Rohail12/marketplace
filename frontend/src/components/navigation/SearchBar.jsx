'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/productService';
import { listCategories } from '@/services/categoryService';
import { listBrands } from '@/services/brandService';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from '@/utils/recentSearches';
import SearchSuggestionsDropdown from '@/components/search/SearchSuggestionsDropdown';

export default function SearchBar({ className = '' }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setRecentSearches(getRecentSearches()); }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]); setCategories([]); setBrands([]);
      return;
    }
    setIsLoading(true);
    // Best-effort client-composed suggestions from existing public
    // list endpoints — a dedicated typeahead/search-ranking endpoint
    // is planned for Phase 55 (Real Search, Filtering & Sorting).
    Promise.all([
      productService.listAll({ search: debouncedQuery, limit: 5 }).catch(() => ({ data: { products: [] } })),
      listCategories({ search: debouncedQuery, limit: 3 }).catch(() => ({ data: { categories: [] } })),
      listBrands({ search: debouncedQuery, limit: 3 }).catch(() => ({ data: { brands: [] } })),
    ]).then(([pRes, cRes, bRes]) => {
      setProducts(pRes.data.products || []);
      setCategories(cRes.data.categories || []);
      setBrands(bRes.data.brands || []);
    }).finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runSearch = useCallback((term) => {
    if (!term.trim()) return;
    addRecentSearch(term);
    setRecentSearches(getRecentSearches());
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleSelectTerm = (term) => {
    setQuery(term);
    runSearch(term);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form role="search" onSubmit={handleSubmit} className="flex">
        <label htmlFor="global-search" className="sr-only">Search products</label>
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, brands, categories..."
          className="w-full rounded-l-md border border-r-0 border-neutral-300 px-3 py-2 text-sm focus-visible:focus-ring dark:border-neutral-700 dark:bg-transparent"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setProducts([]); setCategories([]); setBrands([]); }} aria-label="Clear search" className="border border-l-0 border-neutral-300 px-2 dark:border-neutral-700">
            <FiX size={14} />
          </button>
        )}
        <button type="submit" aria-label="Search" className="flex items-center rounded-r-md bg-primary-600 px-3 text-white hover:bg-primary-700">
          <FiSearch size={16} />
        </button>
      </form>

      {isOpen && (
        <SearchSuggestionsDropdown
          query={query}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
          onSelectTerm={handleSelectTerm}
          products={products}
          categories={categories}
          brands={brands}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}