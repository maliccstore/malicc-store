// features/cart/CartIcon.tsx
'use client';

import { useCartStore } from '@/store/slices/cartStore';

export default function CartIcon() {
  // const items = useCartStore((state) => state.items);
  const items = useCartStore();

  return (
    <div className="relative">
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {items.length}
        </span>
      )}
    </div>
  );
}
