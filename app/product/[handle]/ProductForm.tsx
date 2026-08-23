'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import ShopifyImage from '@/app/components/ShopifyImage';
import type { NormalizedProduct } from '@/lib/shopify/types';
import { useCart } from '@/app/context/CartContext';
import { trackViewContent, trackAddToCart, normalizeVariantId } from '@/lib/meta-pixel';
import { SHIPPING_CONFIG } from '@/lib/config';

interface ProductFormProps {
  product: NormalizedProduct;
}

// Fallback color map for known glazes if the store uses them, 
// but we will render whatever Shopify returns.
const knownColors: Record<string, string> = {
  'SAGE': '#1E2E24',
  'PEACH': '#E5C1B3',
  'CREAM': '#FDFBF7',
  'TERRACOTTA': '#C97A63',
};

export default function ProductForm({ product }: ProductFormProps) {
  const defaultOptions = useMemo(() => {
    const opts: Record<string, string> = {};
    const initialVariant = product.variants.find((variant) => variant.availableForSale) || product.variants[0];

    product.options.forEach((opt) => {
      const selectedValue = initialVariant?.selectedOptions.find((selected) => selected.name === opt.name)?.value;
      opts[opt.name] = selectedValue || opt.values[0];
    });
    return opts;
  }, [product.options, product.variants]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(defaultOptions);
  
  const selectedVariant = useMemo(() => {
    return product.variants.find(variant => {
      return variant.selectedOptions.every(
        opt => selectedOptions[opt.name] === opt.value
      );
    });
  }, [product.variants, selectedOptions]);

  const [activeImage, setActiveImage] = useState(product.image);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const lastVariantIdRef = useRef(selectedVariant?.id);

  useEffect(() => {
    if (selectedVariant && selectedVariant.id !== lastVariantIdRef.current) {
      lastVariantIdRef.current = selectedVariant.id;
      if (selectedVariant.image?.url && activeImage !== selectedVariant.image.url) {
        setIsImageLoaded(false);
        setActiveImage(selectedVariant.image.url);
      }
    }
  }, [selectedVariant, activeImage]);

  const trackedProductIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (product && selectedVariant && trackedProductIdRef.current !== product.id) {
      trackedProductIdRef.current = product.id;

      // Extract numeric ID from gid://shopify/ProductVariant/123456
      const numericVariantId = normalizeVariantId(selectedVariant.id);

      if (numericVariantId) {
        const eventId = crypto.randomUUID();
        const payload = {
          content_ids: [numericVariantId],
          content_type: 'product' as const,
          content_name: product.title,
          value: parseFloat(selectedVariant.price.amount),
          currency: selectedVariant.price.currencyCode,
        };
        trackViewContent(payload, eventId);
        
        fetch('/api/meta/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: 'ViewContent',
            event_id: eventId,
            event_source_url: window.location.href,
            custom_data: payload,
          }),
        }).catch(console.error);
      }
    }
  }, [product, selectedVariant]);
  
  const currentIndex = product.images.indexOf(activeImage);
  const hasMultipleImages = product.images.length > 1;
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === product.images.length - 1;

  const handlePrevImage = () => {
    if (!isFirstImage && activeImage !== product.images[currentIndex - 1]) {
      setIsImageLoaded(false);
      setActiveImage(product.images[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    if (!isLastImage && activeImage !== product.images[currentIndex + 1]) {
      setIsImageLoaded(false);
      setActiveImage(product.images[currentIndex + 1]);
    }
  };

  // Temporarily hide DESCRIPTION by changing default active tab
  // const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [activeTabs, setActiveTabs] = useState<Record<string, boolean>>({});
  const [qty, setQty] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { addCartItem } = useCart();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setErrorMsg('');
    setIsAdding(true);
    try {
      await addCartItem(selectedVariant.id, qty);
      
      const itemPrice = parseFloat(selectedVariant.price.amount);
      const numericVariantId = normalizeVariantId(selectedVariant.id);
      
      const eventId = crypto.randomUUID();
      const payload = {
        content_ids: [numericVariantId],
        content_type: 'product' as const,
        content_name: product.title,
        value: itemPrice * qty,
        currency: selectedVariant.price.currencyCode,
        contents: [
          {
            id: numericVariantId,
            quantity: qty,
            item_price: itemPrice,
          }
        ]
      };
      
      trackAddToCart(payload, eventId);
      
      fetch('/api/meta/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'AddToCart',
          event_id: eventId,
          event_source_url: window.location.href,
          custom_data: payload,
        }),
      }).catch(console.error);
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const toggleAccordion = (tab: string) => {
    setActiveTabs((prev) => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  // Temporarily hide DESCRIPTION tab
  // const accordionTabs = ['DESCRIPTION', 'SHIPPING & RETURNS'];
  const accordionTabs = ['SHIPPING & DELIVERY', 'HANDMADE & CARE'];

  // Format currency
  const price = selectedVariant 
    ? new Intl.NumberFormat('en-EU', { style: 'currency', currency: selectedVariant.price.currencyCode }).format(parseFloat(selectedVariant.price.amount))
    : product.price;

  let compareAtPrice = null;
  let discountPercent = null;
  if (selectedVariant?.compareAtPrice) {
    const cpAmount = parseFloat(selectedVariant.compareAtPrice.amount);
    const pAmount = parseFloat(selectedVariant.price.amount);
    if (cpAmount > pAmount) {
      compareAtPrice = new Intl.NumberFormat('en-EU', { style: 'currency', currency: selectedVariant.compareAtPrice.currencyCode }).format(cpAmount);
      discountPercent = Math.round(((cpAmount - pAmount) / cpAmount) * 100);
    }
  }

  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <>
      {/* LEFT COLUMN — Gallery */}
      <div className="pdp-left-col">
        <div className="pdp-main-image-wrapper">
          <ShopifyImage
            src={activeImage || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200'}
            alt={`${product.title} — Main product image`}
            className="pdp-main-image"
            width={1200}
            height={1200}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            onLoad={() => setIsImageLoaded(true)}
            style={{
              opacity: isImageLoaded ? 1 : 0.8,
              transition: 'opacity 0.2s ease-in-out',
            }}
          />
          {hasMultipleImages && (
            <>
              {!isFirstImage && (
                <button 
                  className="pdp-image-nav-btn prev"
                  onClick={handlePrevImage}
                  aria-label="Previous product image"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
              )}
              {!isLastImage && (
                <button 
                  className="pdp-image-nav-btn next"
                  onClick={handleNextImage}
                  aria-label="Next product image"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}
            </>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="pdp-thumbnail-gallery">
            {product.images.map((src, i) => (
              <button
                key={i}
                className={`pdp-thumbnail${activeImage === src ? ' active' : ''}`}
                onClick={() => {
                  if (activeImage !== src) {
                    setIsImageLoaded(false);
                    setActiveImage(src);
                  }
                }}
                aria-label={`Show product image ${i + 1}`}
                aria-pressed={activeImage === src}
              >
                <ShopifyImage
                  src={src}
                  alt={`${product.title} image ${i + 1}`}
                  width={300}
                  height={300}
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        )}

        <div className="pdp-handmade-note">
          <span className="material-symbols-outlined pdp-handmade-icon">local_florist</span>
          <span>100% handmade • Each piece is unique.</span>
          <span className="material-symbols-outlined pdp-handmade-icon">local_florist</span>
        </div>

        {/* Silent Eager Preload for current product gallery (Vercel optimized URLs) */}
        {product.images.length > 1 && (
          <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', visibility: 'hidden' }} aria-hidden="true">
            {product.images.map((src, i) => {
              if (i === 0) return null; // Main image is already loaded with priority
              return (
                <ShopifyImage
                  key={src}
                  src={src}
                  width={1200}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt=""
                  loading="eager"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="pdp-right-col">
        <div>
          <h1 className="pdp-title">{product.title}</h1>
          <div className="pdp-prices">
            <span className="pdp-price-current">{price}</span>
            {compareAtPrice && (
              <span className="pdp-price-original">{compareAtPrice}</span>
            )}
            {discountPercent && (
              <span className="pdp-discount-badge">-{discountPercent}%</span>
            )}
          </div>
          
          <div className="pdp-usps" style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--sage)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>front_hand</span>
              <span>100% Handmade</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>liquor</span>
              <span>Food-safe Ceramic</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_shipping</span>
              <span>Free US Shipping</span>
            </div>
          </div>
        </div>

        {/* Dynamic Selectors */}
        {product.options.map(option => {
          const isColorType = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('glaze');
          
          if (isColorType) {
            return (
              <div key={option.id} className="pdp-selector-section">
                <div className="pdp-selector-header">
                  <h4 className="pdp-selector-title">{option.name.toUpperCase()}: {selectedOptions[option.name]}</h4>
                </div>
                <div className="pdp-swatches-grid">
                  {option.values.map((val) => (
                    <button
                      key={val}
                      className={`pdp-swatch-wrapper ${selectedOptions[option.name] === val ? 'active' : ''}`}
                      onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: val })}
                      aria-label={`Select ${val} ${option.name}`}
                      aria-pressed={selectedOptions[option.name] === val}
                    >
                      <div 
                        className="pdp-swatch-color" 
                        style={{ backgroundColor: knownColors[val.toUpperCase()] || '#ccc' }}
                      ></div>
                      <span className="pdp-swatch-label">{val}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <div key={option.id} className="pdp-selector-section">
                <div className="pdp-selector-header">
                  <h4 className="pdp-selector-title">{option.name.toUpperCase()}:</h4>
                </div>
                <div className="pdp-pill-swatches">
                  {option.values.map((val) => (
                    <button
                      key={val}
                      className={`pdp-pill-swatch ${selectedOptions[option.name] === val ? 'active' : ''}`}
                      onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: val })}
                      aria-pressed={selectedOptions[option.name] === val}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
        })}

        {/* Cart Actions Container */}
        <div className="pdp-cart-actions">
          {/* Quantity + Availability */}
          <div className="pdp-actions-row">
            <div className="pdp-quantity-pill">
              <button className="pdp-qty-btn" onClick={() => handleQtyChange(-1)} aria-label="Decrease quantity">-</button>
              <span className="pdp-qty-value">{qty}</span>
              <button className="pdp-qty-btn" onClick={() => handleQtyChange(1)} aria-label="Increase quantity">+</button>
            </div>
          </div>

          {/* Add to Cart */}
          {errorMsg && <div style={{ color: 'red', fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMsg}</div>}
          <button 
            className="pdp-add-to-cart" 
            disabled={!isAvailable || isAdding}
            style={{ opacity: isAvailable && !isAdding ? 1 : 0.5, cursor: isAvailable && !isAdding ? 'pointer' : 'not-allowed' }}
            onClick={handleAddToCart}
          >
            {!isAvailable ? 'OUT OF STOCK' : isAdding ? 'ADDING...' : 'ADD TO CART'}
          </button>
        </div>

        {/* 
        <div className="pdp-payment-icons">
          <span className="material-symbols-outlined">credit_card</span>
          <span className="material-symbols-outlined">payments</span>
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        */}

        {/* Accordions */}
        <div className="pdp-accordions">
          {accordionTabs.map((tab) => {
            const isOpen = activeTabs[tab] || false;
            return (
            <div key={tab} className={`pdp-accordion-item ${isOpen ? 'open' : ''}`}>
              <div
                className={`pdp-accordion-header ${isOpen ? 'active' : ''}`}
                onClick={() => toggleAccordion(tab)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleAccordion(tab)}
                aria-expanded={isOpen}
              >
                {tab}
                <span className="material-symbols-outlined">
                  {isOpen ? 'remove' : 'add'}
                </span>
              </div>
              <div className="pdp-accordion-content">
                {/* Temporarily hidden DESCRIPTION block
                {tab === 'DESCRIPTION' && (
                  product.descriptionHtml || product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'rgba(30, 46, 36, 0.6)' }}>No description provided.</p>
                  )
                )}
                */}
                {tab === 'SHIPPING & DELIVERY' && (
                  <ul className="pdp-care-list">
                    <li>Each piece is made to order with care.</li>
                    <li><strong>Standard:</strong> {SHIPPING_CONFIG.timelines.standard}.</li>
                    <li><strong>Priority:</strong> {SHIPPING_CONFIG.timelines.priority}.</li>
                    <li>Timelines may vary slightly during busy periods because every piece is handmade.</li>
                  </ul>
                )}
                {tab === 'HANDMADE & CARE' && (
                  <ul className="pdp-care-list">
                    <li>Each piece is handmade, so slight variations in size, shape, and color may occur compared to the photos.</li>
                    <li>Made from food-safe glazed ceramic, suitable for everyday eating and drinking.</li>
                    <li>Not microwave safe.</li>
                    <li>Wash with soap and water. Colors are designed to remain vibrant with normal use.</li>
                  </ul>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div className="pdp-why-choose-us">
          <h3 className="pdp-wcu-title">Why Choose Us?</h3>
          <div className="pdp-wcu-grid">
            {[
              { icon: 'local_shipping', title: 'FREE SHIPPING', desc: SHIPPING_CONFIG.freeShippingRule },
              { icon: 'assignment_return', title: '14-DAY RETURNS', desc: 'Returns accepted within 14 days of delivery.' },
              { icon: 'liquor', title: 'FOOD-SAFE GLAZE', desc: 'Food-safe glazed ceramic made for everyday drinking and matcha use.' },
              { icon: 'local_florist', title: 'HANDMADE CERAMICS', desc: 'Each piece is individually handmade with care.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="pdp-wcu-item">
                <span className="material-symbols-outlined pdp-wcu-icon">{icon}</span>
                <span className="pdp-wcu-item-title">{title}</span>
                <span className="pdp-wcu-item-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
