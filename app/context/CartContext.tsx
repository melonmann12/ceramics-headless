'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ShopifyCart } from '@/lib/shopify/types';
import { getCartAction, addToCartAction, updateCartItemAction, removeCartItemAction } from '@/app/actions/cart';

interface CartContextType {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isCartLoading: boolean;
  updatingLineId: string | null;
  openCart: () => void;
  closeCart: () => void;
  addCartItem: (variantId: string, quantity: number) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  removeCartItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true); // Loading on mount only
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  
  const cartRef = React.useRef<ShopifyCart | null>(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Defensive filter to enforce Phase 6 invariant: no zero-quantity lines.
  const setValidCart = (newCart: ShopifyCart | null) => {
    if (!newCart) {
      setCart(null);
      return;
    }
    const validEdges = newCart.lines.edges.filter(e => e.node.quantity > 0);
    setCart({
      ...newCart,
      lines: { edges: validEdges }
    });
  };

  const hasHydratedRef = React.useRef(false);

  // Initial fetch
  useEffect(() => {
    async function initCart() {
      try {
        const initialCart = await getCartAction();
        
        // Prevent late hydration from overwriting a mutation that already happened
        if (hasHydratedRef.current || cartRef.current) {
          return;
        }
        
        // Remove zero-qty lines from Shopify async if they exist in hydrated cart
        if (initialCart) {
          const zeroQtyLines = initialCart.lines.edges.filter(e => e.node.quantity <= 0);
          if (zeroQtyLines.length > 0) {
             zeroQtyLines.forEach(line => {
                removeCartItemAction(line.node.id).catch(err => console.error("Failed async remove", err));
             });
          }
        }
        
        setValidCart(initialCart);
      } catch (err) {
        console.error('Failed to init cart', err);
      } finally {
        hasHydratedRef.current = true;
        setIsCartLoading(false);
      }
    }
    initCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addCartItem = async (variantId: string, quantity: number) => {
    if (isMutating) return;
    setIsMutating(true);
    try {
      const updatedCart = await addToCartAction(variantId, quantity || 1);
      setValidCart(updatedCart);
      setIsOpen(true); // Auto-open cart on add
    } finally {
      setIsMutating(false);
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    const currentCart = cartRef.current;
    if (!currentCart || isMutating) return;

    if (quantity <= 0) {
      return removeCartItem(lineId);
    }

    const previousCart = currentCart;
    setUpdatingLineId(lineId);
    setIsMutating(true);

    // Optimistic Update
    const updatedEdges = currentCart.lines.edges.map(edge => {
      if (edge.node.id === lineId) {
         return { ...edge, node: { ...edge.node, quantity } };
      }
      return edge;
    });

    const newTotalQuantity = updatedEdges.reduce((acc, edge) => acc + edge.node.quantity, 0);
    const newSubtotal = updatedEdges.reduce((acc, edge) => {
      return acc + (edge.node.quantity * parseFloat(edge.node.merchandise.price.amount));
    }, 0);

    const optimisticCart: ShopifyCart = {
      ...currentCart,
      totalQuantity: newTotalQuantity,
      cost: {
        ...currentCart.cost,
        subtotalAmount: {
          ...currentCart.cost.subtotalAmount,
          amount: newSubtotal.toString()
        }
      },
      lines: {
        edges: updatedEdges
      }
    };

    setValidCart(optimisticCart);

    try {
      const updatedCart = await updateCartItemAction(lineId, quantity);
      setValidCart(updatedCart); // Reconcile with Shopify's authoritative response
    } catch (error) {
      console.error('Update failed, rolling back.', error);
      setValidCart(previousCart); // Rollback
    } finally {
      setUpdatingLineId(null);
      setIsMutating(false);
    }
  };

  const removeCartItem = async (lineId: string) => {
    const currentCart = cartRef.current;
    if (!currentCart || isMutating) return;
    const previousCart = currentCart;

    setUpdatingLineId(lineId);
    setIsMutating(true);

    // Optimistic Update
    const updatedEdges = currentCart.lines.edges.filter(edge => edge.node.id !== lineId);
    const newTotalQuantity = updatedEdges.reduce((acc, edge) => acc + edge.node.quantity, 0);
    const newSubtotal = updatedEdges.reduce((acc, edge) => {
      return acc + (edge.node.quantity * parseFloat(edge.node.merchandise.price.amount));
    }, 0);

    const optimisticCart: ShopifyCart = {
      ...currentCart,
      totalQuantity: newTotalQuantity,
      cost: {
        ...currentCart.cost,
        subtotalAmount: {
          ...currentCart.cost.subtotalAmount,
          amount: newSubtotal.toString()
        }
      },
      lines: {
        edges: updatedEdges
      }
    };

    setValidCart(optimisticCart);

    try {
      const updatedCart = await removeCartItemAction(lineId);
      setValidCart(updatedCart); // Reconcile
    } catch (error) {
      console.error('Remove failed, rolling back.', error);
      setValidCart(previousCart); // Rollback
    } finally {
      setUpdatingLineId(null);
      setIsMutating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isCartLoading,
        updatingLineId,
        openCart,
        closeCart,
        addCartItem,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
