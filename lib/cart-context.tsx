"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("yellolab-cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("yellolab-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev?.find((i: CartItem) => i?.id === item?.id);
      if (existing) {
        return (prev ?? []).map((i: CartItem) =>
          i?.id === item?.id ? { ...(i ?? {}), quantity: (i?.quantity ?? 0) + 1 } : i
        );
      }
      return [...(prev ?? []), { ...(item ?? {}), quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => (prev ?? []).filter((i: CartItem) => i?.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => (prev ?? []).filter((i: CartItem) => i?.id !== id));
    } else {
      setItems((prev) =>
        (prev ?? []).map((i: CartItem) => (i?.id === id ? { ...(i ?? {}), quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = (items ?? []).reduce((sum: number, i: CartItem) => sum + (i?.quantity ?? 0), 0);
  const totalPrice = (items ?? []).reduce((sum: number, i: CartItem) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
