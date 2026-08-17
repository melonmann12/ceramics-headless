'use server';

import { cookies } from 'next/headers';
import { getCart, createCart, addToCart, updateCart, removeFromCart } from '@/lib/shopify/cart';
import type { ShopifyCart } from '@/lib/shopify/types';

const CART_COOKIE_NAME = 'shopify_cart_id';

export async function getCartAction(): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    return null;
  }

  const cart = await getCart(cartId);
  
  if (!cart) {
    // Cart expired or invalid
    cookieStore.delete(CART_COOKIE_NAME);
    return null;
  }

  return cart;
}

export async function addToCartAction(merchandiseId: string, quantity: number): Promise<ShopifyCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  let cart: ShopifyCart | null = null;

  try {
    if (cartId) {
      // Try to add to existing cart
      cart = await addToCart(cartId, [{ merchandiseId, quantity }]);
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
  } catch (error) {
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
  } catch (error) {
    console.error('Action removeCartItemAction failed:', error);
    throw error;
  }
}
