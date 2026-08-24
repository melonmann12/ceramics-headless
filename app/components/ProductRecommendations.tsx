import { getProductRecommendations } from '@/lib/shopify/queries';
import ProductGrid from '@/app/components/ProductGrid';
import './ProductRecommendations.css';

interface ProductRecommendationsProps {
  productId: string;
}

export default async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const recommendations = await getProductRecommendations(productId);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Ensure the current product is excluded and we only show available products
  const filteredRecommendations = recommendations
    .filter((p) => p.id !== productId && p.availableForSale)
    .slice(0, 4); // Target: 4 products visible in one row

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <ProductGrid
      products={filteredRecommendations}
      title="YOU MAY ALSO LIKE"
      className="pdp-recommendations"
    />
  );
}
