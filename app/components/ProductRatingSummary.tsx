import { getJudgeMeRatingsMap } from '@/lib/judgeme/client';
import './ProductRatingSummary.css';

interface ProductRatingSummaryProps {
  productId: string;
  showEmptyPlaceholder?: boolean;
  linkToReviews?: boolean;
}

export default async function ProductRatingSummary({ 
  productId, 
  showEmptyPlaceholder = false,
  linkToReviews = false
}: ProductRatingSummaryProps) {
  const ratingsMap = await getJudgeMeRatingsMap();
  
  // Extract the numeric Shopify ID from the GID
  const numericId = productId.split('/').pop();
  if (!numericId) return null;
  
  const rating = ratingsMap[numericId];
  
  if (!rating || rating.reviewCount === 0) {
    if (showEmptyPlaceholder) {
      // PDP Style
      const emptyContent = (
        <>
          <span className="material-symbols-outlined rating-star rating-star-empty">star</span>
          <span className="rating-empty-text">Be the first to review</span>
        </>
      );
      
      return linkToReviews ? (
        <a href="#reviews" className="product-rating product-rating-empty product-rating-link">
          {emptyContent}
        </a>
      ) : (
        <div className="product-rating product-rating-empty">
          {emptyContent}
        </div>
      );
    } else {
      // ProductGrid Style
      return (
        <div className="product-rating product-rating-grid-empty" aria-hidden="true">
          <div className="rating-stars-wrapper">
            <div className="rating-stars-empty grid-empty-stars">
              <span className="material-symbols-outlined star-icon">star</span>
              <span className="material-symbols-outlined star-icon">star</span>
              <span className="material-symbols-outlined star-icon">star</span>
              <span className="material-symbols-outlined star-icon">star</span>
              <span className="material-symbols-outlined star-icon">star</span>
            </div>
          </div>
          <span className="rating-grid-empty-text">No reviews</span>
        </div>
      );
    }
  }

  const fillPercentage = (rating.averageRating / 5) * 100;
  
  const ariaLabel = `Rated ${rating.averageRating.toFixed(1)} out of 5 from ${rating.reviewCount} reviews`;
  
  const content = (
    <>
      <div className="rating-stars-wrapper" aria-hidden="true">
        <div className="rating-stars-empty">
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
        </div>
        <div className="rating-stars-filled" style={{ width: `${fillPercentage}%` }}>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
          <span className="material-symbols-outlined star-icon">star</span>
        </div>
      </div>
      <span className="rating-score" aria-hidden="true">{rating.averageRating.toFixed(1)}</span>
      <span className="rating-count" aria-hidden="true">({rating.reviewCount})</span>
    </>
  );

  if (linkToReviews) {
    return (
      <a href="#reviews" className="product-rating product-rating-link" aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <div className="product-rating" aria-label={ariaLabel}>
      {content}
    </div>
  );
}
