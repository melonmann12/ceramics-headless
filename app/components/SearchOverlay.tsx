'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import ShopifyImage from '@/app/components/ShopifyImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchProductsAction } from '@/app/actions/search';
import type { NormalizedProduct } from '@/lib/shopify/types';
import './SearchOverlay.css';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NormalizedProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus and layout effect
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setError('');
    }
  }, [isOpen]);

  // Debounce Autocomplete
  useEffect(() => {
    if (!isOpen) return;
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      setError('');
      return;
    }

    const timer = setTimeout(() => {
      setError('');
      setHasSearched(true);
      startTransition(async () => {
        try {
          const products = await searchProductsAction(trimmedQuery, 5); // Limit autocomplete to 5
          setResults(products);
        } catch (searchError) {
          console.error('Search failed:', searchError);
          setResults([]);
          setError('Search is temporarily unavailable.');
        }
      });
    }, 350); // 350ms debounce

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <>
      <button className="search-overlay-backdrop" aria-label="Close search" onClick={onClose} />
      <section className="search-overlay" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div className="search-overlay-header">
          <div>
            <h2 id="search-title" className="search-overlay-title">Search ASHPIA</h2>
            <p className="search-overlay-subtitle">Find products from the live Shopify catalog.</p>
          </div>
          <button className="search-close-btn" onClick={onClose} aria-label="Close search">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <label className="search-label" htmlFor="storefront-search">Product search</label>
          <div className="search-input-row">
            <span className="material-symbols-outlined search-input-icon">search</span>
            <input
              id="storefront-search"
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (error) setError('');
              }}
              className="search-input"
              type="search"
              placeholder="Search ceramics"
              autoComplete="off"
            />
            <button className="search-submit-btn" type="submit" disabled={isPending}>
              {isPending ? 'SEARCHING' : 'SEARCH'}
            </button>
          </div>
        </form>

        {error && <p className="search-message search-error">{error}</p>}

        <div className="search-results" aria-live="polite">
          {isPending && <p className="search-message">Searching Shopify products...</p>}

          {!isPending && hasSearched && results.length === 0 && !error && (
            <p className="search-message">No products found for “{query.trim()}”.</p>
          )}

          {!isPending && results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              className="search-result"
              onClick={onClose}
            >
              <div className="search-result-image-wrap">
                {product.image ? (
                  <ShopifyImage
                    src={product.image}
                    alt={product.title}
                    width={96}
                    height={96}
                    className="search-result-image"
                  />
                ) : (
                  <span className="search-result-image-placeholder">No image</span>
                )}
              </div>
              <div className="search-result-copy">
                <span className="search-result-title">{product.title}</span>
                <span className="search-result-price">{product.price}</span>
                <span className="search-result-availability">
                  {product.availableForSale ? 'Available' : 'Out of stock'}
                </span>
              </div>
              <span className="material-symbols-outlined search-result-arrow">arrow_forward</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
