'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NormalizedProduct } from '@/lib/shopify/types';
import { useCart } from '@/app/context/CartContext';

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
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
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
    setActiveTab(activeTab === tab ? '' : tab);
  };

  const accordionTabs = ['DESCRIPTION', 'SHIPPING & RETURNS'];

  // Format currency
  const price = selectedVariant 
    ? new Intl.NumberFormat('en-EU', { style: 'currency', currency: selectedVariant.price.currencyCode }).format(parseFloat(selectedVariant.price.amount))
    : product.price;

  let compareAtPrice = null;
  if (selectedVariant?.compareAtPrice) {
    const cpAmount = parseFloat(selectedVariant.compareAtPrice.amount);
    const pAmount = parseFloat(selectedVariant.price.amount);
    if (cpAmount > pAmount) {
      compareAtPrice = new Intl.NumberFormat('en-EU', { style: 'currency', currency: selectedVariant.compareAtPrice.currencyCode }).format(cpAmount);
    }
  }

  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <>
      {/* LEFT COLUMN — Gallery */}
      <div className="pdp-left-col">
        <Image
          src={activeImage || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200'}
          alt={`${product.title} — Main product image`}
          className="pdp-main-image"
          width={1200}
          height={1200}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {product.images.length > 1 && (
          <div className="pdp-thumbnail-gallery">
            {product.images.map((src, i) => (
              <button
                key={i}
                className={`pdp-thumbnail${activeImage === src ? ' active' : ''}`}
                onClick={() => setActiveImage(src)}
                aria-label={`Show product image ${i + 1}`}
                aria-pressed={activeImage === src}
              >
                <Image
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
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
          100% handmade • Slight variations make each piece unique.
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
        </div>
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
          </div>
          
          <div className="pdp-installments">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
            <span>Final shipping, taxes, and payment options are confirmed in Shopify Checkout.</span>
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
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
                )}
                {tab === 'SHIPPING & RETURNS' && (
                  <p>
                    Shipping and return details are available on the{' '}
                    <Link href="/shipping-policy">Shipping Policy</Link>
                    {' '}and{' '}
                    <Link href="/returns">Returns</Link>
                    {' '}pages. Final shipping rates are shown at checkout.
                  </p>
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
              { icon: 'local_shipping', title: 'CHECKOUT RATES', desc: 'Shipping is calculated before payment' },
              { icon: 'verified_user', title: 'SHOPIFY CHECKOUT', desc: 'Orders are completed through hosted checkout' },
              { icon: 'assignment_return', title: 'RETURNS POLICY', desc: 'Review eligibility before ordering' },
              { icon: 'inventory_2', title: 'REAL AVAILABILITY', desc: 'Variants come directly from Shopify' },
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
