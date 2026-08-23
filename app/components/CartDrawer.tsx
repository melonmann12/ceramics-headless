'use client';

import React, { useState, useEffect } from 'react';
import ShopifyImage from '@/app/components/ShopifyImage';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateCartItem, removeCartItem, isCartLoading, updatingLineId } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Reset redirecting state if user navigates back via bfcache
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsRedirecting(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const lines = cart?.lines?.edges || [];

  useEffect(() => {
    if (isOpen) {
      console.log(`[Diagnostic] CartDrawer rendering with ${lines.length} lines. Subtotal: ${cart?.cost?.subtotalAmount?.amount}`);
      lines.forEach(({ node }) => {
        console.log(`[Diagnostic]  - Rendered line ${node.id.slice(-5)} (variant ${node.merchandise.id.slice(-5)}), qty: ${node.quantity}`);
      });
    }
  }, [cart, isOpen, lines]);

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) {
      setCheckoutError('Checkout is currently unavailable. Please try again later.');
      return;
    }
    if (lines.length === 0) return;

    setCheckoutError('');
    setIsRedirecting(true);

    try {
      const parsedUrl = new URL(cart.checkoutUrl);
      console.log('checkout host:', parsedUrl.hostname);
      console.log('checkout path:', parsedUrl.pathname);
      console.log('has key param:', parsedUrl.searchParams.has('key') || parsedUrl.searchParams.has('token'));
    } catch (e) {
      console.log('checkoutUrl is not a valid URL:', cart.checkoutUrl);
    }
    
    window.location.href = cart.checkoutUrl;
  };

  return (
    <>
      {isOpen && (
        <style dangerouslySetInnerHTML={{ __html: `
          .back-to-top { display: none !important; }
          iframe[id*="gorgias"], 
          [id*="gorgias-chat"], 
          [id*="gorgias-web-messenger"],
          #gorgias-chat-container { display: none !important; }
        `}} />
      )}
      {/* Overlay */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">YOUR CART</h2>
          <button className="cart-drawer-close" onClick={closeCart} aria-label="Close cart">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="cart-drawer-body" style={{ position: 'relative' }}>
          {isCartLoading && (
            <div className="cart-loading-overlay">
              <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
            </div>
          )}

          {lines.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is currently empty.</p>
              <button className="cart-checkout-btn" onClick={closeCart} style={{ marginTop: '1rem' }}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            lines.map(({ node }) => {
              const merchandise = node.merchandise;
              const product = merchandise.product;
              const price = new Intl.NumberFormat('en-EU', {
                style: 'currency',
                currency: merchandise.price.currencyCode,
              }).format(parseFloat(merchandise.price.amount));

              return (
                <div key={node.id} className="cart-item">
                  <Link href={`/product/${product.handle}`} onClick={closeCart}>
                    <ShopifyImage
                      src={product.featuredImage?.url || ''}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="cart-item-image"
                    />
                  </Link>
                  <div className="cart-item-details">
                    <Link href={`/product/${product.handle}`} onClick={closeCart} className="cart-item-title">
                      {product.title}
                    </Link>
                    
                    <p className="cart-item-options">
                      {merchandise.title !== 'Default Title' ? merchandise.title : ''}
                    </p>
                    
                    <p className="cart-item-price">{price}</p>
                    
                    <div className="cart-item-actions">
                      <div className="cart-qty-controls">
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateCartItem(node.id, node.quantity - 1)}
                          disabled={updatingLineId === node.id || isRedirecting}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="cart-qty-value" style={{ opacity: updatingLineId === node.id ? 0.5 : 1 }}>
                          {node.quantity}
                        </span>
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateCartItem(node.id, node.quantity + 1)}
                          disabled={updatingLineId === node.id || isRedirecting}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeCartItem(node.id)}
                        disabled={updatingLineId === node.id || isRedirecting}
                        style={{ opacity: updatingLineId === node.id ? 0.5 : 1, cursor: updatingLineId === node.id ? 'not-allowed' : 'pointer' }}
                      >
                        {updatingLineId === node.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {lines.length > 0 && cart?.cost && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('en-EU', {
                  style: 'currency',
                  currency: cart.cost.subtotalAmount.currencyCode,
                }).format(parseFloat(cart.cost.subtotalAmount.amount))}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--sage)', marginBottom: '1rem', textAlign: 'center' }}>
              Free standard US shipping. Taxes calculated at checkout.
            </p>
            {checkoutError && (
              <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
                {checkoutError}
              </p>
            )}
            <button 
              className="cart-checkout-btn" 
              onClick={handleCheckout}
              disabled={isCartLoading || isRedirecting}
              style={{ opacity: isRedirecting ? 0.7 : 1, cursor: isRedirecting ? 'wait' : 'pointer' }}
            >
              {isRedirecting ? 'REDIRECTING...' : 'CHECKOUT'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
