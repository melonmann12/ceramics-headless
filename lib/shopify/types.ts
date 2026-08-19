// ─── Scalar types ────────────────────────────────────────────────────────────

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// ─── Variant ─────────────────────────────────────────────────────────────────

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage | null;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  vendor: string;
  productType: string;
  featuredImage: ShopifyImage | null;
  images: {
    edges: { node: ShopifyImage }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2;
  };
  seo: {
    title: string;
    description: string;
  };
  createdAt: string;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
    price: MoneyV2;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount: MoneyV2 | null;
  };
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
}

// ─── Helper types ─────────────────────────────────────────────────────────────

  /** Flattened product suitable for use in UI components */
export interface NormalizedProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: string;
  compareAtPrice: string | null;
  badge?: string;
  image: string;
  images: string[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: ShopifyProductVariant[];
  availableForSale: boolean;
  createdAt: string;
}
