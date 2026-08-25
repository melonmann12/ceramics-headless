import type { NormalizedProduct } from '@/lib/shopify/types';
import type { JudgeMeRatingsMap } from '@/lib/judgeme/client';

export function filterAndSortProducts(
  products: NormalizedProduct[],
  searchParams: {
    sort?: string;
    availability?: string;
    price?: string;
  },
  ratingsMap?: JudgeMeRatingsMap
): NormalizedProduct[] {
  let result = [...products];

  // 1. Filter by Availability
  if (searchParams.availability === 'in-stock') {
    result = result.filter(p => p.availableForSale);
  }

  // 2. Filter by Price Range
  if (searchParams.price) {
    result = result.filter(p => {
      // grab the first variant's raw price for accurate filtering
      const rawPrice = parseFloat(p.variants[0]?.price.amount || '0');
      
      if (searchParams.price === 'under-50') return rawPrice < 50;
      if (searchParams.price === '50-100') return rawPrice >= 50 && rawPrice <= 100;
      if (searchParams.price === 'over-100') return rawPrice > 100;
      
      return true;
    });
  }

  // 3. Sort Results
  if (searchParams.sort === 'price-asc') {
    result.sort((a, b) => {
      const priceA = parseFloat(a.variants[0]?.price.amount || '0');
      const priceB = parseFloat(b.variants[0]?.price.amount || '0');
      return priceA - priceB;
    });
  } else if (searchParams.sort === 'price-desc') {
    result.sort((a, b) => {
      const priceA = parseFloat(a.variants[0]?.price.amount || '0');
      const priceB = parseFloat(b.variants[0]?.price.amount || '0');
      return priceB - priceA;
    });
  } else if (searchParams.sort === 'newest') {
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // newest first
    });
  } else if (searchParams.sort === 'highest-rated' && ratingsMap) {
    // We need the original index to use as a stable tie-breaker
    const indexedResult = result.map((p, index) => ({ p, index }));
    
    indexedResult.sort((a, b) => {
      const numericIdA = a.p.id.split('/').pop() || '';
      const numericIdB = b.p.id.split('/').pop() || '';
      const ratingA = ratingsMap[numericIdA] || { averageRating: 0, reviewCount: 0 };
      const ratingB = ratingsMap[numericIdB] || { averageRating: 0, reviewCount: 0 };

      // 1. Sort by average rating descending
      if (ratingB.averageRating !== ratingA.averageRating) {
        return ratingB.averageRating - ratingA.averageRating;
      }
      // 2. Tie-breaker: review count descending
      if (ratingB.reviewCount !== ratingA.reviewCount) {
        return ratingB.reviewCount - ratingA.reviewCount;
      }
      // 3. Tie-breaker: preserve original sort order (which is Best Selling)
      return a.index - b.index;
    });
    
    result = indexedResult.map(item => item.p);
  } else if (searchParams.sort === 'best-selling') {
    // Do nothing: result is already natively sorted by BEST_SELLING from Shopify
  }
  return result;
}
