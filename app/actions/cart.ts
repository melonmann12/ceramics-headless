'use server';

import { cookies } from 'next/headers';
import { getCart, createCart, addToCart, updateCart, removeFromCart, updateCartBuyerIdentity, DEFAULT_BUYER_COUNTRY } from '@/lib/shopify/cart';
import type { ShopifyCart } from '@/lib/shopify/types';

const CART_COOKIE_NAME = 'shopify_cart_id';

export async function getCartAction(): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    return null;
  }

  let cart = await getCart(cartId);
  
  if (!cart) {
    // Cart expired or invalid
    cookieStore.delete(CART_COOKIE_NAME);
    return null;
  }

  // Ensure cart is upgraded to the correct buyer identity on load
  if (cart.buyerIdentity?.countryCode !== DEFAULT_BUYER_COUNTRY) {
    try {
      cart = await updateCartBuyerIdentity(cartId, DEFAULT_BUYER_COUNTRY) || cart;
    } catch (e) {
      console.error('Failed to upgrade cart buyer identity on hydration', e);
    }
  }

  return cart;
}

export async function addToCartAction(merchandiseId: string, quantity: number): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  let cart: ShopifyCart | null = null;

  try {
    if (cartId) {
      try {
        // Upgrade existing cart to US market context if it's not already
        const existingCart = await getCart(cartId);
        if (existingCart && existingCart.buyerIdentity?.countryCode !== DEFAULT_BUYER_COUNTRY) {
          await updateCartBuyerIdentity(cartId, DEFAULT_BUYER_COUNTRY);
        }

        // Try to add to existing cart
        cart = await addToCart(cartId, [{ merchandiseId, quantity }]);
      } catch (addError: any) {
        console.warn(`Failed to add to existing cart ${cartId}:`, addError.message);
        // Fall through to create a new cart
        cart = null;
      }
    }

    // If no cart id, or if adding failed (e.g. invalid cart), create a new one
    if (!cart) {
      cart = await createCart([{ merchandiseId, quantity }]);
      if (cart) {
        cookieStore.set(CART_COOKIE_NAME, cart.id, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }
    }

    // Shopify Storefront API can silently clamp quantity to 0 if an item is out of stock.
    // Validate that the returned cart actually contains the merchandise with qty >= 1.
    if (cart) {
      const addedLine = cart.lines.edges.find(e => e.node.merchandise?.id === merchandiseId);
      if (!addedLine || addedLine.node.quantity < 1) {
        console.error(`Add to cart failed. Shopify clamped quantity to 0 for ${merchandiseId} in cart ${cart.id}.`);
        throw new Error('This item is currently out of stock and cannot be added to your cart.');
      }
    }
  } catch (error) {
    console.error('Action addToCartAction failed:', error);
    throw error;
  }

  return cart;
}

export async function updateCartItemAction(lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    throw new Error('No active cart');
  }

  try {
    return await updateCart(cartId, [{ id: lineId, quantity }]);
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      console.warn(`[Self-Healing] Stale line ID ${lineId.slice(-5)} in update. Fetching fresh cart.`);
      return await getCart(cartId);
    }
    console.error('Action updateCartItemAction failed:', error);
    throw error;
  }
}

export async function removeCartItemAction(lineId: string): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    throw new Error('No active cart');
  }

  try {
    return await removeFromCart(cartId, [lineId]);
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      console.warn(`[Self-Healing] Stale line ID ${lineId.slice(-5)} in remove. Fetching fresh cart.`);
      return await getCart(cartId);
    }
    console.error('Action removeCartItemAction failed:', error);
    throw error;
  }
}
