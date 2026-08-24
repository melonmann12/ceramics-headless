'use client';

import { useState, useEffect, useRef } from 'react';
import { submitJudgeMeReview } from '@/app/actions/submit-review';
import './WriteReviewForm.css';

export default function WriteReviewForm({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files);
    let validFiles: File[] = [];
    let errorMessage = '';

    const currentTotal = selectedFiles.length + newFiles.length;
    if (currentTotal > 5) {
      errorMessage = 'You can only upload a maximum of 5 images.';
    }

    const remainingSlots = Math.max(0, 5 - selectedFiles.length);
    const filesToProcess = newFiles.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errorMessage = 'Please only upload images (JPEG, PNG, WEBP).';
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errorMessage = 'Each image must be smaller than 5MB.';
        continue;
      }
      validFiles.push(file);
    }

    if (errorMessage) {
      setErrorMsg(errorMessage);
    } else {
      setErrorMsg('');
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
    
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('productId', productId);
    formData.append('rating', rating.toString());
    
    // Override the native file input which might have been cleared
    formData.delete('images');
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    const res = await submitJudgeMeReview(formData);
    if (res.success) {
      setStatus('success');
      setSelectedFiles([]);
      setPreviews([]);
    } else {
      setStatus('error');
      setErrorMsg(res.error || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="write-review-toggle-btn" 
        onClick={() => setIsOpen(true)}
      >
        Write a Review
      </button>
    );
  }

  if (status === 'success') {
    return (
      <div className="write-review-success">
        <p className="success-icon"><span className="material-symbols-outlined">check_circle</span></p>
        <p>Thank you! Your review has been submitted.</p>
        <p className="success-subtext">It may take a little time to appear.</p>
      </div>
    );
  }

  return (
    <div className="write-review-container">
      <div className="write-review-header">
        <h3>Write a Review</h3>
        <button className="write-review-close" onClick={() => setIsOpen(false)} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {status === 'error' && (
        <div className="write-review-error">{errorMsg}</div>
      )}

      <form className="write-review-form" onSubmit={handleSubmit}>
        {/* Honeypot field for basic bot protection */}
        <input type="text" name="bot_field" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

        <div className="form-group rating-group">
          <label>Rating</label>
          <div className="rating-input-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-select-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <span className="material-symbols-outlined">star</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="review-name">Name</label>
            <input type="text" id="review-name" name="name" required placeholder="Jane Doe" maxLength={100} />
          </div>
          <div className="form-group">
            <label htmlFor="review-email">Email</label>
            <input type="email" id="review-email" name="email" required placeholder="jane@example.com" maxLength={200} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review-title">Review Title</label>
          <input type="text" id="review-title" name="title" placeholder="Summary of your experience" maxLength={200} />
        </div>

        <div className="form-group">
          <label htmlFor="review-body">Review</label>
          <textarea id="review-body" name="body" required rows={4} placeholder="What did you love about this piece?" maxLength={5000}></textarea>
        </div>

        <div className="form-group image-upload-group">
          <label className="image-upload-label">
            Add Photos <span>(Optional, max 5)</span>
          </label>
          <div className="image-previews-container">
            {previews.map((src, idx) => (
              <div key={idx} className="image-preview-wrapper">
                <img src={src} alt="Preview" className="image-preview-thumb" />
                <button 
                  type="button" 
                  className="image-remove-btn" 
                  onClick={() => removeFile(idx)}
                  aria-label="Remove image"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
            {selectedFiles.length < 5 && (
              <div className="image-upload-btn-wrapper">
                <label className="image-upload-btn">
                  <span className="material-symbols-outlined">add_a_photo</span>
                  <input 
                    type="file" 
                    name="images" 
                    accept="image/jpeg,image/png,image/webp" 
                    multiple 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-review-btn" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
