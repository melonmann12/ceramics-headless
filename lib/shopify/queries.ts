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
    createdAt
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
          image {
            url
            altText
            width
            height
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
    createdAt: product.createdAt || new Date().toISOString(),
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

  const decodedHandle = decodeURIComponent(handle);

  const { data, errors } = await shopifyClient.request(query, {
    variables: { handle: decodedHandle },
  });

  if (errors || !data?.product) {
    console.error('[Shopify] Product not found by handle:', {
      handle: decodedHandle,
      hasData: Boolean(data),
      productIsNull: data?.product === null,
      errors: errors || null
    });
    return null;
  }

  return normalizeProduct(data.product as ShopifyProduct);
}

/** Fetch products for the homepage grid (and sitemap) */
export async function getProducts(limit?: number): Promise<NormalizedProduct[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after, sortKey: BEST_SELLING) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  let hasNextPage = true;
  let endCursor: string | null = null;
  let allProducts: NormalizedProduct[] = [];

  const fetchSize = limit ? Math.min(limit, 250) : 250;

  while (hasNextPage) {
    const { data, errors } = await shopifyClient.request<{ products?: any }>(query, {
      variables: { first: fetchSize, after: endCursor },
    });

    if (errors || !data?.products) {
      console.error('[Shopify] getProducts errors:', errors);
      break;
    }

    const productsData = data.products as any;
    
    const pageProducts = (productsData as { edges: { node: ShopifyProduct }[] }).edges.map((e) =>
      normalizeProduct(e.node),
    );
    allProducts.push(...pageProducts);

    if (limit && allProducts.length >= limit) {
      allProducts = allProducts.slice(0, limit);
      break;
    }

    hasNextPage = productsData.pageInfo.hasNextPage;
    endCursor = productsData.pageInfo.endCursor;
  }

  return allProducts;
}

/** Fetch products for a specific collection by handle */
export async function getCollectionProducts(handle: string, limit?: number): Promise<{ title: string; products: NormalizedProduct[] } | null> {
  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        title
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    }
  `;

  let hasNextPage = true;
  let endCursor: string | null = null;
  let allProducts: NormalizedProduct[] = [];
  let collectionTitle = '';

  const fetchSize = limit ? Math.min(limit, 250) : 250;

  while (hasNextPage) {
    const { data, errors } = await shopifyClient.request<{ collection?: any }>(query, {
      variables: { handle, first: fetchSize, after: endCursor },
    });

    if (errors) {
      console.error('[Shopify] getCollectionProducts errors:', errors);
      break;
    }

    if (!data?.collection) {
      console.error('[Shopify] Collection not found or unavailable', {
        handle,
        status: 200,
        collectionIsNull: true
      });
      if (allProducts.length === 0) return null;
      break;
    }

    collectionTitle = data.collection.title;
    const productsData: any = data.collection.products;
    
    const pageProducts = (productsData as { edges: { node: ShopifyProduct }[] }).edges.map((e) =>
      normalizeProduct(e.node),
    );
    allProducts.push(...pageProducts);

    if (limit && allProducts.length >= limit) {
      allProducts = allProducts.slice(0, limit);
      break;
    }

    hasNextPage = productsData.pageInfo.hasNextPage;
    endCursor = productsData.pageInfo.endCursor;
  }

  return { title: collectionTitle, products: allProducts };
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

/** Fetch product recommendations for a specific product */
export async function getProductRecommendations(productId: string, limit = 8): Promise<NormalizedProduct[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FIELDS}
    query GetProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        ...ProductFields
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: { productId },
  });

  if (errors || !data?.productRecommendations) {
    console.error('[Shopify] getProductRecommendations errors:', errors);
    return [];
  }

  return (data.productRecommendations as ShopifyProduct[])
    .slice(0, limit)
    .map((p) => normalizeProduct(p));
}
