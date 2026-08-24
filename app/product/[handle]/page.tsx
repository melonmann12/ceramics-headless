import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductForm from './ProductForm';
import ProductRatingSummary from '@/app/components/ProductRatingSummary';
import ProductReviews from '@/app/components/ProductReviews';
import ProductJsonLd from '@/app/components/ProductJsonLd';
import ProductRecommendations from '@/app/components/ProductRecommendations';
import { getProductByHandle } from '@/lib/shopify/queries';
import './PDP.css';

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/product/${product.handle}`,
    },
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200',
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <div className="pdp-page">
      <Suspense fallback={null}>
        <ProductJsonLd product={product} />
      </Suspense>
      <Header />

      <div className="pdp-content-wrapper">
        <main className="pdp-main">
          <ProductForm 
            product={product} 
            ratingSummary={
              <Suspense fallback={null}>
                <ProductRatingSummary productId={product.id} showEmptyPlaceholder={true} linkToReviews={true} />
              </Suspense>
            }
          />
        </main>
      </div>
      
      {/* Reviews Section */}
      <Suspense fallback={null}>
        <ProductReviews productId={product.id} />
      </Suspense>

      {/* Recommendations Section */}
      <Suspense fallback={null}>
        <ProductRecommendations productId={product.id} />
      </Suspense>

      <Footer />
    </div>
  );
}
