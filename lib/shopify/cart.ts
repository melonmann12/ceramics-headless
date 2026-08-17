import { shopifyClient } from './client';
import type { ShopifyCart } from './types';

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                title
                handle
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = /* GraphQL */ `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(query, {
    variables: { cartId },
  });

  if (errors || !data?.cart) {
    return null;
  }

  return data.cart as ShopifyCart;
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart | null> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(mutation, {
    variables: {
      input: {
        lines,
      },
    },
  });

  if (errors || data?.cartCreate?.userErrors?.length) {
    console.error('Create cart errors', errors || data?.cartCreate?.userErrors);
    if (data?.cartCreate?.userErrors?.length) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }
    return null;
  }

  return data?.cartCreate?.cart as ShopifyCart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart | null> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(mutation, {
    variables: {
      cartId,
      lines,
    },
  });

  if (errors || data?.cartLinesAdd?.userErrors?.length) {
    console.error('Add to cart errors', errors || data?.cartLinesAdd?.userErrors);
    if (data?.cartLinesAdd?.userErrors?.length) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }
    return null;
  }

  return data?.cartLinesAdd?.cart as ShopifyCart;
}

export async function updateCart(cartId: string, lines: { id: string; quantity: number }[]): Promise<ShopifyCart | null> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(mutation, {
    variables: {
      cartId,
      lines,
    },
  });

  if (errors || data?.cartLinesUpdate?.userErrors?.length) {
    console.error('Update cart errors', errors || data?.cartLinesUpdate?.userErrors);
    if (data?.cartLinesUpdate?.userErrors?.length) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }
    return null;
  }

  return data?.cartLinesUpdate?.cart as ShopifyCart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await shopifyClient.request(mutation, {
    variables: {
      cartId,
      lineIds,
    },
  });

  if (errors || data?.cartLinesRemove?.userErrors?.length) {
    console.error('Remove from cart errors', errors || data?.cartLinesRemove?.userErrors);
    if (data?.cartLinesRemove?.userErrors?.length) {
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }
    return null;
  }

  return data?.cartLinesRemove?.cart as ShopifyCart;
}
