import { getJudgeMeRatingsMap, getJudgeMeProductReviews } from '@/lib/judgeme/client';
import type { NormalizedProduct } from '@/lib/shopify/types';

function serializeJsonLd(data: any) {
  // Safely serialize JSON-LD preventing </script> injection
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function ProductJsonLd({ product }: { product: NormalizedProduct }) {
  const numericId = product.id.split('/').pop();
  if (!numericId) return null;

  const [ratingsMap, reviewsData] = await Promise.all([
    getJudgeMeRatingsMap(),
    getJudgeMeProductReviews(numericId)
  ]);

  const summary = ratingsMap[numericId];
  const reviews = reviewsData?.reviews || [];

  const canonicalUrl = `https://www.ashpia.com/product/${product.handle}`;

  const offers = product.variants.map((variant) => ({
    "@type": "Offer",
    "priceCurrency": variant.price.currencyCode,
    "price": variant.price.amount,
    "availability": variant.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    "url": canonicalUrl
  }));

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images.length > 0 ? product.images : undefined,
    "url": canonicalUrl,
    "brand": {
      "@type": "Brand",
      "name": "Ashpia"
    },
    // If multiple variants have different prices, use AggregateOffer
    "offers": offers.length === 1 ? offers[0] : {
      "@type": "AggregateOffer",
      "priceCurrency": offers[0].priceCurrency,
      "lowPrice": Math.min(...offers.map(o => parseFloat(o.price))).toFixed(2),
      "highPrice": Math.max(...offers.map(o => parseFloat(o.price))).toFixed(2),
      "offerCount": offers.length,
      "offers": offers
    }
  };

  if (summary && summary.reviewCount > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": summary.averageRating,
      "reviewCount": summary.reviewCount
    };
    
    if (reviews.length > 0) {
      structuredData.review = reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.reviewer_display_name ?? review.reviewer?.name ?? 'Anonymous'
        },
        "datePublished": new Date(review.created_at).toISOString().split('T')[0],
        "reviewBody": review.body,
        "name": review.title || undefined,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5",
          "worstRating": "1"
        }
      }));
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}
