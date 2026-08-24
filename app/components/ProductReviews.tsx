import { getJudgeMeProductReviews, getJudgeMeRatingsMap } from '@/lib/judgeme/client';
import WriteReviewForm from './WriteReviewForm';
import ReviewCard from './ReviewCard';
import './ProductReviews.css';



export default async function ProductReviews({ productId }: { productId: string }) {
  const numericId = productId.split('/').pop();
  if (!numericId) return null;

  const [ratingsMap, reviewsData] = await Promise.all([
    getJudgeMeRatingsMap(),
    getJudgeMeProductReviews(numericId)
  ]);

  const summary = ratingsMap[numericId];
  const reviews = reviewsData?.reviews || [];

  if (!summary || summary.reviewCount === 0 || reviews.length === 0) {
    return (
      <section id="reviews" className="product-reviews-section">
        <div className="container">
          <div className="reviews-header-block">
            <h2 className="reviews-heading">Customer Reviews</h2>
          </div>
          <div className="reviews-empty">
            <p>No reviews yet.</p>
            <p>Be the first to share your experience with this piece.</p>
            <WriteReviewForm productId={numericId} />
          </div>
        </div>
      </section>
    );
  }

  const averageFillPercentage = (summary.averageRating / 5) * 100;

  return (
    <section id="reviews" className="product-reviews-section">
      <div className="container">
        <div className="reviews-header-block">
          <h2 className="reviews-heading">Customer Reviews</h2>
          <WriteReviewForm productId={numericId} />
        </div>
        
        {/* Top Summary */}
        <div className="reviews-summary">
          <div className="rating-stars-wrapper" aria-label={`Rated ${summary.averageRating.toFixed(1)} out of 5 from ${summary.reviewCount} reviews`}>
            <div className="rating-stars-empty">
              {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined star-icon">star</span>)}
            </div>
            <div className="rating-stars-filled" style={{ width: `${averageFillPercentage}%` }}>
              {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined star-icon">star</span>)}
            </div>
          </div>
          <span className="reviews-summary-score">{summary.averageRating.toFixed(1)}</span>
          <span className="reviews-summary-count">({summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''})</span>
        </div>

        {/* Individual Reviews */}
        <div className="reviews-list">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
