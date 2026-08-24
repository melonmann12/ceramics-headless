'use client';

import { useState, useEffect, useRef } from 'react';
import type { JudgeMeReview } from '@/lib/judgeme/client';
import './ReviewCard.css';

export default function ReviewCard({ review }: { review: JudgeMeReview }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const displayName = review.reviewer_display_name ?? review.reviewer?.name ?? 'Anonymous';

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    
    // Check initially and on resize
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [review.body]);
  
  const hasImages = review.pictures && review.pictures.filter(p => !p.hidden).length > 0;
  const reply = review.answers && review.answers.length > 0 ? review.answers[0] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleModalBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const renderStars = () => (
    <div className="review-rating" aria-label={`Rated ${review.rating} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`material-symbols-outlined star-icon ${i < review.rating ? 'star-filled' : 'star-empty'}`}>
          star
        </span>
      ))}
    </div>
  );

  const renderHeader = () => (
    <div className="review-header">
      <span className="review-author-name">{displayName}</span>
      {review.verified === 'buyer' && (
        <span className="review-verified">
          <span className="material-symbols-outlined verified-icon">check_circle</span>
        </span>
      )}
    </div>
  );

  return (
    <>
      <div className="review-card">
        {renderStars()}
        {renderHeader()}
        
        {review.title && <div className="review-title-subtle">{review.title}</div>}
        
        <div className="review-content">
          <p className="review-body line-clamp" ref={textRef}>
            {review.body}
          </p>
          {isTruncated && (
            <button 
              className="review-more-btn" 
              onClick={() => setIsModalOpen(true)}
            >
              More
            </button>
          )}
        </div>

        {hasImages && (
          <div className="review-media-strip">
            {review.pictures.filter(p => !p.hidden).map((pic, idx) => (
              <button key={idx} className="review-thumbnail-btn" onClick={() => setIsModalOpen(true)}>
                <img 
                  src={pic.urls.compact} 
                  alt={`Review photo ${idx + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {reply && (
          <div className="review-reply-preview">
            <span className="reply-label">Reply from Ashpia</span>
            <p>{reply.body.length > 80 ? `${reply.body.substring(0, 80)}...` : reply.body}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="review-modal-overlay" 
          onClick={handleModalBackgroundClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="review-modal-content">
            <button 
              className="review-modal-close" 
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            {renderStars()}
            {renderHeader()}
            
            <hr className="review-modal-divider" />
            
            {review.title && <div className="review-title-subtle modal-title">{review.title}</div>}
            
            <div className="review-full-body">
              <p>{review.body}</p>
            </div>

            {hasImages && (
              <div className="review-modal-images">
                {review.pictures.filter(p => !p.hidden).map((pic, idx) => (
                  <div key={idx} className="review-modal-image-wrapper">
                    <img 
                      src={pic.urls.huge || pic.urls.original} 
                      alt={`Review photo ${idx + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {reply && (
              <div className="review-reply-full">
                <span className="reply-label">Reply from Ashpia</span>
                <p>{reply.body}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
