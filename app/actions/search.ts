'use server';

import { searchProducts } from '@/lib/shopify/queries';
import type { NormalizedProduct } from '@/lib/shopify/types';

export async function searchProductsAction(query: string, limit: number = 8): Promise<NormalizedProduct[]> {
  return searchProducts(query, limit);
}
