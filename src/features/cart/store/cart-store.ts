'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity) }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                unit: product.unit,
                price: product.currentPrice,
                quantity: Math.min(quantity, product.stockQuantity),
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl,
              },
            ],
          });
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);
        if (!item) return;
        
        set({
          items: items.map((i) =>
            i.id === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stockQuantity)) }
              : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "nexus-cart-storage",
    }
  )
);
