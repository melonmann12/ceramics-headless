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

  // Initial fetch
  useEffect(() => {
    async function initCart() {
      try {
        const initialCart = await getCartAction();
        setCart(initialCart);
      } catch (err) {
        console.error('Failed to init cart', err);
      } finally {
        setIsCartLoading(false);
      }
    }
    initCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addCartItem = async (variantId: string, quantity: number) => {
    const updatedCart = await addToCartAction(variantId, quantity);
    setCart(updatedCart);
    setIsOpen(true); // Auto-open cart on add
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    const previousCart = cart;

    setUpdatingLineId(lineId);

    // Optimistic Update
    const updatedEdges = cart.lines.edges.map(edge => {
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
      ...cart,
      totalQuantity: newTotalQuantity,
      cost: {
        ...cart.cost,
        subtotalAmount: {
          ...cart.cost.subtotalAmount,
          amount: newSubtotal.toString()
        }
      },
      lines: {
        edges: updatedEdges
      }
    };

    setCart(optimisticCart);

    try {
      const updatedCart = await updateCartItemAction(lineId, quantity);
      setCart(updatedCart); // Reconcile
    } catch (error) {
      console.error('Update failed, rolling back.', error);
      setCart(previousCart); // Rollback
    } finally {
      setUpdatingLineId(null);
    }
  };

  const removeCartItem = async (lineId: string) => {
    if (!cart) return;
    const previousCart = cart;

    setUpdatingLineId(lineId);

    // Optimistic Update
    const updatedEdges = cart.lines.edges.filter(edge => edge.node.id !== lineId);
    const newTotalQuantity = updatedEdges.reduce((acc, edge) => acc + edge.node.quantity, 0);
    const newSubtotal = updatedEdges.reduce((acc, edge) => {
      return acc + (edge.node.quantity * parseFloat(edge.node.merchandise.price.amount));
    }, 0);

    const optimisticCart: ShopifyCart = {
      ...cart,
      totalQuantity: newTotalQuantity,
      cost: {
        ...cart.cost,
        subtotalAmount: {
          ...cart.cost.subtotalAmount,
          amount: newSubtotal.toString()
        }
      },
      lines: {
        edges: updatedEdges
      }
    };

    setCart(optimisticCart);

    try {
      const updatedCart = await removeCartItemAction(lineId);
      setCart(updatedCart); // Reconcile
    } catch (error) {
      console.error('Remove failed, rolling back.', error);
      setCart(previousCart); // Rollback
    } finally {
      setUpdatingLineId(null);
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
