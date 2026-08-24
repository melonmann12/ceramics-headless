import Link from 'next/link';
import ShopifyImage from '@/app/components/ShopifyImage';
import type { NormalizedProduct } from '@/lib/shopify/types';
import ProductRatingSummary from '@/app/components/ProductRatingSummary';
import './ProductGrid.css';

interface ProductGridProps {
  products: NormalizedProduct[];
  title?: string;
  eyebrow?: string;
  intro?: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

export default function ProductGrid({
  products,
  title,
  eyebrow,
  intro,
  ctaHref,
  ctaLabel,
  className = '',
}: ProductGridProps) {
  const shouldEagerLoadImages = className.split(' ').includes('homepage-featured');

  return (
    <section className={`products-section ${className}`.trim()} id="bestsellers">
      <div className="container">
        {(eyebrow || title || intro) && (
          <div className="products-header">
            {eyebrow && <p className="products-eyebrow">{eyebrow}</p>}
            {title && <h2 className="products-heading">{title}</h2>}
            {intro && <p className="products-intro">{intro}</p>}
          </div>
        )}
        
        {products.length === 0 ? (
          <div className="products-empty">
            No products available at the moment. Please check back later!
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const href = `/product/${product.handle}`;
              
              return (
                <div key={product.id} className="product-card">
                  <Link href={href} className="product-link">
                    <div className="product-image-wrapper">
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      {product.image ? (
                        <ShopifyImage
                          src={product.image}
                          alt={product.title}
                          className="product-image"
                          width={600}
                          height={600}
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading={shouldEagerLoadImages ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="product-image-placeholder">Product image unavailable</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <ProductRatingSummary productId={product.id} />
                      <p className="product-price">
                        {product.compareAtPrice && (
                          <span className="price-original">{product.compareAtPrice}</span>
                        )}
                        {product.price}
                      </p>
                    </div>
                  </Link>
                  <div className="product-actions">
                    <Link
                      href={href}
                      className="add-to-cart-btn"
                    >
                      <span className="material-symbols-outlined add-to-cart-icon">shopping_bag</span>
                      {product.availableForSale ? 'VIEW OPTIONS' : 'OUT OF STOCK'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {ctaHref && ctaLabel && (
          <div className="products-cta">
            <Link href={ctaHref} className="pill-btn pill-btn-outline">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
