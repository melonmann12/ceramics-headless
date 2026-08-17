import { shopifyClient } from './client';
import type { ShopifyProduct, NormalizedProduct } from './types';

// ─── GraphQL Fragments ────────────────────────────────────────────────────────

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    vendor
    productType
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    seo {
      title
      description
    }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMoney(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

function normalizeProduct(product: ShopifyProduct): NormalizedProduct {
  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant
    ? formatMoney(firstVariant.price.amount, firstVariant.price.currencyCode)
    : formatMoney(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      );

  const compareAtPrice =
    firstVariant?.compareAtPrice
      ? formatMoney(firstVariant.compareAtPrice.amount, firstVariant.compareAtPrice.currencyCode)
      : null;

  const images = product.images.edges.map((e) => e.node.url);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    price,
    compareAtPrice,
    image: product.featuredImage?.url ?? images[0] ?? '',
    images,
    options: product.options,
    variants: product.variants.edges.map((e) => e.node),
    availableForSale: product.variants.edges.some((e) => e.node.availableForSale),
    // Derive a badge from tags if the store uses them (e.g. tag: "bestseller")
    badge: product.tags.find((t) =>
      ['bestseller', 'new', 'set', 'sale'].includes(t.toLowerCase()),
    )?.toUpperCase(),
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Fetch a single product by its handle for the PDP */
export async function getProductByHandle(handle: string): Promise<NormalizedProduct | null> {
  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: { handle },
  });

  if (errors || !data?.product) {
    console.error('[Shopify] getProductByHandle errors:', errors);
    return null;
  }

  return normalizeProduct(data.product as ShopifyProduct);
}

/** Fetch products for the homepage grid (and sitemap) */
export async function getProducts(first = 12): Promise<NormalizedProduct[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: { first },
  });

  if (errors || !data?.products) {
    console.error('[Shopify] getProducts errors:', errors);
    return [];
  }

  return (data.products as { edges: { node: ShopifyProduct }[] }).edges.map((e) =>
    normalizeProduct(e.node),
  );
}

/** Search published Shopify products by a shopper-entered query */
export async function searchProducts(queryText: string, first = 8): Promise<NormalizedProduct[]> {
  const trimmedQuery = queryText.trim();

  if (!trimmedQuery) {
    return [];
  }

  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query SearchProducts($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: {
      first,
      query: trimmedQuery,
    },
  });

  if (errors || !data?.products) {
    console.error('[Shopify] searchProducts errors:', errors);
    return [];
  }

  return (data.products as { edges: { node: ShopifyProduct }[] }).edges.map((e) =>
    normalizeProduct(e.node),
  );
}

/** Fetch all product handles — used by generateStaticParams and sitemap.ts */
export async function getAllProductHandles(): Promise<string[]> {
  const query = /* GraphQL */ `
    query GetAllHandles($first: Int!) {
      products(first: $first) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: { first: 250 },
  });

  if (errors || !data?.products) {
    console.error('[Shopify] getAllProductHandles errors:', errors);
    return [];
  }

  return (data.products as { edges: { node: { handle: string } }[] }).edges.map(
    (e) => e.node.handle,
  );
}
