import 'server-only';
import { cache } from 'react';

export interface JudgeMeProductRating {
  averageRating: number;
  reviewCount: number;
}

export interface JudgeMeRatingsMap {
  [productExternalId: string]: JudgeMeProductRating;
}

/**
 * Fetches published reviews from Judge.me and computes the aggregate
 * average rating and review count per product.
 */
export const getJudgeMeRatingsMap = cache(async (): Promise<JudgeMeRatingsMap> => {
  const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
  const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

  if (!privateToken || !storeDomain) {
    console.warn('Judge.me tokens or domain missing. Returning empty ratings map.');
    return {};
  }

  try {
    // Judge.me /api/v1/reviews endpoint (default per_page is up to 100).
    // For a large store, we would need to paginate this. For now, fetching up to 1000 reviews is safe.
    // In a production store with >10,000 reviews, we might use webhooks or store metafields instead.
    const res = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${privateToken}&shop_domain=${storeDomain}&per_page=1000&published=true`,
      {
        next: {
          revalidate: 3600,
          tags: ['judgeme-ratings'],
        },
      }
    );

    if (!res.ok) {
      console.error(`Judge.me API error: ${res.statusText}`);
      return {};
    }

    const data = await res.json();
    const reviews = data.reviews || [];

    const ratingsMap: Record<string, { sum: number; count: number }> = {};

    for (const review of reviews) {
      const id = review.product_external_id?.toString();
      if (!id || typeof review.rating !== 'number') continue;

      if (!ratingsMap[id]) {
        ratingsMap[id] = { sum: 0, count: 0 };
      }
      ratingsMap[id].sum += review.rating;
      ratingsMap[id].count += 1;
    }

    const finalMap: JudgeMeRatingsMap = {};
    for (const [id, stats] of Object.entries(ratingsMap)) {
      finalMap[id] = {
        averageRating: Number((stats.sum / stats.count).toFixed(2)),
        reviewCount: stats.count
      };
    }

    return finalMap;
  } catch (error) {
    console.error('Error fetching Judge.me reviews map:', error);
    return {};
  }
});

export interface JudgeMeReviewer {
  id: number;
  name: string;
  email?: string;
  accepts_marketing?: boolean;
}

export interface JudgeMePicture {
  urls: {
    small: string;
    compact: string;
    huge: string;
    original: string;
  };
  hidden: boolean;
}

export interface JudgeMeReview {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  product_external_id: number;
  product_id?: number;
  reviewer: JudgeMeReviewer;
  created_at: string;
  updated_at: string;
  curated: string;
  published: boolean;
  hidden: boolean;
  verified: string;
  pictures: JudgeMePicture[];
  answers?: {
    id?: number;
    body: string;
    created_at?: string;
  }[];
}

export interface JudgeMeReviewsResponse {
  current_page: number;
  per_page: number;
  reviews: JudgeMeReview[];
}

/**
 * Resolves a Shopify external product ID to the internal Judge.me product ID.
 */
export const getJudgeMeInternalProductId = cache(async (productExternalId: string): Promise<number | null> => {
  const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
  const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

  if (!privateToken || !storeDomain) return null;

  try {
    const res = await fetch(
      `https://judge.me/api/v1/products/-1?api_token=${privateToken}&shop_domain=${storeDomain}&external_id=${productExternalId}`,
      {
        next: {
          revalidate: 86400,
          tags: [`judgeme-product-map-${productExternalId}`],
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.product?.id || null;
  } catch (error) {
    console.error(`Error resolving Judge.me internal product ID for ${productExternalId}:`, error);
    return null;
  }
});

/**
 * Fetches published reviews for a specific product by its external ID.
 */
export const getJudgeMeProductReviews = cache(async (productExternalId: string, page = 1, perPage = 10): Promise<JudgeMeReviewsResponse | null> => {
  const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;
  const storeDomain = process.env.JUDGEME_SHOP_DOMAIN;

  if (!privateToken || !storeDomain) {
    console.warn('Judge.me tokens or domain missing. Returning null reviews.');
    return null;
  }

  try {
    const internalProductId = await getJudgeMeInternalProductId(productExternalId);
    if (!internalProductId) {
      return null; // No mapping exists, so no reviews exist
    }

    const res = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${privateToken}&shop_domain=${storeDomain}&product_id=${internalProductId}&page=${page}&per_page=${perPage}&published=true`,
      {
        next: {
          revalidate: 900,
          tags: [`judgeme-product-${productExternalId}`],
        },
      }
    );

    if (!res.ok) {
      console.error(`Judge.me API error for product ${productExternalId}: ${res.statusText}`);
      return null;
    }

    const data: JudgeMeReviewsResponse = await res.json();

    const requestedExternalId = Number(productExternalId);
    return {
      ...data,
      reviews: (data.reviews || []).filter((review) => (
        Number(review.product_external_id) === requestedExternalId
      )),
    };
  } catch (error) {
    console.error(`Error fetching Judge.me reviews for product ${productExternalId}:`, error);
    return null;
  }
});
