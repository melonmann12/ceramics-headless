'use client';

import { useState } from 'react';

interface Glaze {
  id: string;
  color: string;
}

interface ProductFormProps {
  productTitle: string;
  price: string;
  compareAtPrice?: string;
  variantId?: string;
}

const glazes: Glaze[] = [
  { id: 'SAGE', color: '#1E2E24' },
  { id: 'PEACH', color: '#E5C1B3' },
  { id: 'CREAM', color: '#FDFBF7' },
  { id: 'TERRACOTTA', color: '#C97A63' },
];

const sizes = ['300ML', '450ML'];

export default function ProductForm({
  productTitle,
  price,
  compareAtPrice,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [activeGlaze, setActiveGlaze] = useState('SAGE');
  const [activeSize, setActiveSize] = useState('300ML');
  const [qty, setQty] = useState(1);

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const toggleAccordion = (tab: string) => {
    setActiveTab(activeTab === tab ? '' : tab);
  };

  const accordionTabs = ['DESCRIPTION', 'ARTISAN STORY', 'SPECS', 'PRODUCTION TIME', 'SHIPPING'];

  return (
    <div className="pdp-right-col">
      <div>
        <h1 className="pdp-title">{productTitle}</h1>
        <div className="pdp-prices">
          <span className="pdp-price-current">{price}</span>
          {compareAtPrice && (
            <span className="pdp-price-original">{compareAtPrice}</span>
          )}
        </div>
        
        <div className="pdp-installments">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
          <span>
            Pay in 4 interest-free installments with Shop Pay.{' '}
            <a href="#" style={{ textDecoration: 'underline' }}>Learn more</a>
          </span>
        </div>

        <div className="pdp-ratings">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="material-symbols-outlined" style={{ fontSize: '18px' }}>star</span>
          ))}
          <span className="pdp-review-count">(12 reviews)</span>
        </div>
      </div>

      {/* Glaze Selector */}
      <div className="pdp-selector-section">
        <div className="pdp-selector-header">
          <h4 className="pdp-selector-title">CHOOSE YOUR GLAZE: {activeGlaze}</h4>
        </div>
        <div className="pdp-swatches-grid">
          {glazes.map((glaze) => (
            <div
              key={glaze.id}
              className={`pdp-swatch-wrapper ${activeGlaze === glaze.id ? 'active' : ''}`}
              onClick={() => setActiveGlaze(glaze.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${glaze.id} glaze`}
              onKeyDown={(e) => e.key === 'Enter' && setActiveGlaze(glaze.id)}
            >
              <div className="pdp-swatch-color" style={{ backgroundColor: glaze.color }}></div>
              <span className="pdp-swatch-label">{glaze.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="pdp-selector-section">
        <div className="pdp-selector-header">
          <h4 className="pdp-selector-title">SELECT SIZE:</h4>
          <a href="#" className="pdp-sizing-link">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>straighten</span>
            Sizing chart
          </a>
        </div>
        <div className="pdp-pill-swatches">
          {sizes.map((size) => (
            <button
              key={size}
              className={`pdp-pill-swatch ${activeSize === size ? 'active' : ''}`}
              onClick={() => setActiveSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Availability */}
      <div className="pdp-actions-row">
        <div className="pdp-quantity-pill">
          <button className="pdp-qty-btn" onClick={() => handleQtyChange(-1)} aria-label="Decrease quantity">-</button>
          <span className="pdp-qty-value">{qty}</span>
          <button className="pdp-qty-btn" onClick={() => handleQtyChange(1)} aria-label="Increase quantity">+</button>
        </div>

      </div>

      {/* Add to Cart */}
      <button className="pdp-add-to-cart">
        ADD TO CART
      </button>

      <div className="pdp-payment-icons">
        <span className="material-symbols-outlined">credit_card</span>
        <span className="material-symbols-outlined">payments</span>
        <span className="material-symbols-outlined">account_balance_wallet</span>
      </div>

      {/* Accordions */}
      <div className="pdp-accordions">
        {accordionTabs.map((tab) => (
          <div key={tab} className={`pdp-accordion-item ${activeTab === tab ? 'open' : ''}`}>
            <div
              className={`pdp-accordion-header ${activeTab === tab ? 'active' : ''}`}
              onClick={() => toggleAccordion(tab)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleAccordion(tab)}
            >
              {tab}
              <span className="material-symbols-outlined">
                {activeTab === tab ? 'remove' : 'add'}
              </span>
            </div>
            <div className="pdp-accordion-content">
              {tab === 'DESCRIPTION' && (
                <p>
                  A delicate piece crafted from the finest earth.<br /><br />
                  Molded by hand, fired in silence, meant for reflection.<br />
                  Each curve tells a story of patience and raw beauty, elevating your daily matcha ritual into a moment of true serenity.
                </p>
              )}
              {tab === 'SPECS' && (
                <ul>
                  <li>Volume: ~{activeSize}</li>
                  <li>Dimensions: 11cm diameter, 7.5cm height</li>
                  <li>Food safe &amp; lead-free glaze</li>
                  <li>Handwash recommended</li>
                </ul>
              )}
              {tab !== 'DESCRIPTION' && tab !== 'SPECS' && (
                <p>Details and information regarding {tab.toLowerCase()} for this handcrafted piece. Ships worldwide.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="pdp-why-choose-us">
        <h3 className="pdp-wcu-title">Why Choose Us?</h3>
        <div className="pdp-wcu-grid">
          {[
            { icon: 'local_shipping', title: 'FREE SHIPPING', desc: 'Delivered with care to your door' },
            { icon: 'verified_user', title: 'SECURE CHECKOUT', desc: 'Safe & reliable payment methods' },
            { icon: 'assignment_return', title: 'EASY RETURNS', desc: '14 days to return or exchange' },
            { icon: 'star', title: 'LOVED BY CERAMISTS', desc: '1000+ five-star reviews' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="pdp-wcu-item">
              <span className="material-symbols-outlined pdp-wcu-icon">{icon}</span>
              <span className="pdp-wcu-item-title">{title}</span>
              <span className="pdp-wcu-item-desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Review */}
      <div className="pdp-review-block">
        <div className="pdp-review-header">
          <div className="pdp-reviewer-avatar">L</div>
          <div>
            <div className="pdp-reviewer-name">Layla</div>
            <div className="pdp-ratings">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
              ))}
            </div>
          </div>
        </div>
        <p className="pdp-review-text">&quot;Great craftsmanship, lovely design, and fast shipping. Love it!&quot;</p>
      </div>
    </div>
  );
}
