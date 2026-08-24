'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import './Footer.css';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-content">
          {/* Left Side: Navigation Columns */}
          <div className="footer-nav-wrapper">
            <div className="footer-logo-container">
              <Image src="/logo/ashpialogo.png" alt="Ashpia" width={100} height={31} className="footer-logo-img" />
            </div>

            <div className="footer-links footer-links-main">
              <Link href="/" className="footer-link">HOME</Link>
              <Link href="/shop" className="footer-link">SHOP ALL</Link>
              <Link href="/about" className="footer-link">ABOUT US</Link>
              <Link href="/contact" className="footer-link">CONTACT</Link>
              <Link href="/track-order" className="footer-link">TRACK ORDER</Link>
            </div>

            <div className="footer-links footer-links-legal">
              <Link href="/shipping-policy" className="footer-link">SHIPPING</Link>
              <Link href="/returns" className="footer-link">RETURNS</Link>
              <Link href="/privacy-policy" className="footer-link">PRIVACY</Link>
              <Link href="/terms" className="footer-link">TERMS</Link>
            </div>

            <div className="footer-socials">
              <a href="https://www.facebook.com/profile.php?id=61593385899498" target="_blank" rel="noopener noreferrer" aria-label="ASHPIA on Facebook" className="footer-social-link">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/ashpia.ceramic/" target="_blank" rel="noopener noreferrer" aria-label="ASHPIA on Instagram" className="footer-social-link">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-newsletter-wrapper">
            <NewsletterForm />
            {/* Customer Care temporarily hidden
            <div className="footer-care-card">
              <h3 className="footer-care-heading">CUSTOMER CARE</h3>
              <p className="footer-care-text">Questions about an order, shipping, returns, or product care?</p>
              <Link href="/contact" className="footer-care-link">
                MESSAGE US
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </Link>
            </div>
            */}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© 2026 ASHPIA. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>

      <button 
        className={`back-to-top ${showTopBtn ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑ Back to Top
      </button>
    </footer>
  );
}
