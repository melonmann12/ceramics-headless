'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import './CatalogFilters.css';

export default function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  const hasFilters = searchParams.has('availability') || searchParams.has('price') || searchParams.has('sort');

  const clearFilters = () => {
    const q = searchParams.get('q');
    if (q) {
      router.push(`${pathname}?q=${encodeURIComponent(q)}`);
    } else {
      router.push(pathname);
    }
  };

  return (
    <div className="search-filters-container">
      <div className="search-filter-group">
        <label htmlFor="sort" className="search-filter-label">Sort By</label>
        <select
          id="sort"
          className="search-filter-select"
          value={searchParams.get('sort') || ''}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="">Relevance / Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="search-filter-group">
        <label htmlFor="availability" className="search-filter-label">Availability</label>
        <select
          id="availability"
          className="search-filter-select"
          value={searchParams.get('availability') || ''}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
        >
          <option value="">All</option>
          <option value="in-stock">In stock</option>
        </select>
      </div>

      <div className="search-filter-group">
        <label htmlFor="price" className="search-filter-label">Price Range</label>
        <select
          id="price"
          className="search-filter-select"
          value={searchParams.get('price') || ''}
          onChange={(e) => handleFilterChange('price', e.target.value)}
        >
          <option value="">Any</option>
          <option value="under-50">Under €50</option>
          <option value="50-100">€50 - €100</option>
          <option value="over-100">Over €100</option>
        </select>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="search-filter-clear">
          Clear Filters
        </button>
      )}
    </div>
  );
}
