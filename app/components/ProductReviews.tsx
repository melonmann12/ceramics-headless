import { getJudgeMeProductReviews, getJudgeMeRatingsMap, type JudgeMeReview } from '@/lib/judgeme/client';
import WriteReviewForm from './WriteReviewForm';
import ReviewCard from './ReviewCard';
import './ProductReviews.css';

const DEV_REVIEW_FIXTURE: JudgeMeReview = {
  id: 999999999,
  title: "Even better in person",
  body: "I absolutely love this matcha set. The ceramic feels sturdy and beautifully handmade, and the little details are even nicer in person than they looked in the photos. The bowl is a really comfortable size for whisking matcha, the pouring spout works surprisingly well, and the matching holder looks adorable next to it on my counter. Everything was packed carefully and arrived safely. I have already used it several times and it has quickly become one of my favorite pieces in the kitchen. The handmade finish gives it so much personality, and I would definitely order another design from Ashpia.",
  rating: 5,
  product_external_id: 0,
  reviewer: {
    id: 999999,
    name: "Test Customer"
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  curated: "ok",
  published: true,
  hidden: false,
  verified: "buyer",
  pictures: [
    {
      urls: {
        small: "/homepage/homepage.png",
        compact: "/homepage/homepage.png",
        huge: "/homepage/homepage.png",
        original: "/homepage/homepage.png"
      },
      hidden: false
    },
    {
      urls: {
        small: "/homepage/homepage.png",
        compact: "/homepage/homepage.png",
        huge: "/homepage/homepage.png",
        original: "/homepage/homepage.png"
      },
      hidden: false
    }
  ],
  answers: [
    {
      body: "Thank you so much for your lovely review! We're so happy the set arrived safely and that you're enjoying your matcha moments with it. ♡"
    }
  ]
};

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
          {/* UI test data only - never submitted or indexed */}
          {process.env.NODE_ENV === 'development' && (
            <ReviewCard key="dev-fixture" review={DEV_REVIEW_FIXTURE} />
          )}
        </div>
      </div>
    </section>
  );
}
