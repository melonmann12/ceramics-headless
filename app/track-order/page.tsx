'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Script from 'next/script';
import './TrackOrder.css';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [hasTracked, setHasTracked] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmed = trackingNumber.trim();
    if (!trimmed) {
      setError('Please enter a tracking number to begin.');
      return;
    }
    
    // Basic length validation to prevent abuse (most tracking numbers are between 8 and 40 chars)
    if (trimmed.length < 5 || trimmed.length > 50) {
      setError('Please check your tracking number and try again.');
      return;
    }

    setHasTracked(true);

    // Call the 17TRACK widget function
    // @ts-ignore
    if (typeof window !== 'undefined' && window.YQV5) {
      // @ts-ignore
      window.YQV5.trackSingle({
        YQ_ContainerId: 'YQContainer',
        YQ_Height: 600,
        YQ_Fc: '0',
        YQ_Lang: 'en',
        YQ_Num: trimmed
      });
    } else {
      setError('Tracking service is currently unavailable. Please try again later.');
    }
  };

  return (
    <div className="track-order-page">
      <Header />
      
      {/* 17TRACK External Script */}
      <Script 
        src="https://www.17track.net/externalcall.js" 
        strategy="lazyOnload" 
      />

      <main className="track-main">
        <section className="track-hero">
          <div className="track-container">
            <p className="track-eyebrow">ORDER STATUS</p>
            <h1 className="track-title">TRACK YOUR ORDER</h1>
            <p className="track-desc">
              Enter your tracking number to see the latest shipping updates for your order.
            </p>

            <form onSubmit={handleTrack} className="track-form">
              <div className="track-input-group">
                <input
                  type="text"
                  id="YQNum"
                  className="track-input"
                  placeholder="Tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  maxLength={50}
                  autoComplete="off"
                  spellCheck="false"
                />
                <button type="submit" className="pill-btn track-btn">
                  TRACK
                </button>
              </div>
              {error && <p className="track-error">{error}</p>}
              {!error && <p className="track-help">You can find your tracking number in your shipping confirmation email.</p>}
            </form>
          </div>
        </section>

        {/* 17TRACK Widget Container */}
        <section className={`track-results-section ${hasTracked && !error ? 'active' : ''}`}>
          <div id="YQContainer" className="track-widget-container"></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
