import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) => set((state) => {
        const existingItem = state.items.find((i) => i._id === product._id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          };
        }
        return { items: [...state.items, { ...product, quantity }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i._id !== productId),
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' } // This saves the cart to LocalStorage automatically!
  )
);
