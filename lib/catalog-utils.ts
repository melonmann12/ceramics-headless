import type { NormalizedProduct } from '@/lib/shopify/types';

export function filterAndSortProducts(
  products: NormalizedProduct[],
  searchParams: {
    sort?: string;
    availability?: string;
    price?: string;
  }
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
  }
  // Relevance / Featured (default) relies on Shopify's native ordering in the result array

  return result;
}
