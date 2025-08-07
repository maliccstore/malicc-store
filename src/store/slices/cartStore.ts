import { Product } from '@/types/product';
// import { create } from 'zustand';

// interface CartState {
//   items: Product[];
//   addItem: (product: Product) => void;
//   removeItem: (productID: string) => void;
//   clearCart: () => void;
// }

// export const useCartStore = create<CartState>((set) => ({
//   items: [],
//   addItem: (product) => set((state) => ({ items: [...state.items, product] })),
//   removeItem: (productID) =>
//     set((state) => ({
//       items: state.items.filter((item) => item.id !== productID),
//     })),
//   clearCart: () => set({ items: [] }),
// }));

export function useCartStore() {
  const items: Product[] = [];
  return items;
}
