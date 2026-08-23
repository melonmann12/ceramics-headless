'use client';

import { useState } from 'react';
import Link from 'next/link';
import './NewsletterForm.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website: honeypot }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.code === 'EMAIL_ALREADY_EXISTS') {
          setStatus('duplicate');
          return;
        }
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-card">
      <h3 className="newsletter-heading">JOIN THE ASHPIA COMMUNITY</h3>
      <p className="newsletter-subtext">Be the first to discover new handmade pieces, restocks, and studio updates.</p>
      
      {status === 'success' ? (
        <div className="newsletter-message success">
          Thank you for joining the ASHPIA community.
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          {/* Honeypot field for basic anti-spam */}
          <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
            <input 
              type="text" 
              name="website" 
              tabIndex={-1} 
              autoComplete="off" 
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="newsletter-input-group">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Email address"
            />
            <button 
              type="submit" 
              className="newsletter-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'JOINING...' : 'JOIN'}
            </button>
          </div>
          
          {status === 'error' && (
            <div className="newsletter-message error">{errorMessage}</div>
          )}
          {status === 'duplicate' && (
            <div className="newsletter-message error">
              This email is already associated with an existing customer. Please update your email preferences or <Link href="/contact" style={{textDecoration: 'underline'}}>contact us</Link> for help.
            </div>
          )}

          <div className="newsletter-consent">
            By joining, you agree to receive marketing emails from ASHPIA. You can unsubscribe at any time. <Link href="/privacy-policy" className="newsletter-consent-link">Privacy Policy</Link>
          </div>
        </form>
      )}
    </div>
  );
}
