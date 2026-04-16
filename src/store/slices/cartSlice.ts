import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "@/types/product";
import { RootState } from "..";
import { cartAPI } from "@/services/cart.service";
import toast from "react-hot-toast";
import { trackEvent } from "@/services/analytics/analytics.service";
import { ANALYTICS_EVENTS } from "@/constants/event-constants";
import { getSessionId } from "@/services/analytics/session";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isCartOpen: false,
};

//  Utility to avoid repetition
const recalculateTotals = (state: CartState) => {
  state.totalQuantity = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  state.totalAmount = state.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
};

// Thunk to update cart item
export const updateCartItemThunk = createAsyncThunk(
  "cart/updateItem",
  async (
    {
      productId,
      newQuantity,
      product,
    }: { productId: string; newQuantity: number; product?: Product },
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const cartItem = state.cart.items.find(
      (i) => String(i.id) === String(productId),
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const isAuthenticated = state.auth.isAuthenticated;
    const user = state.auth.user;

    // 1. Validate against stock
    const availableQuantity =
      product?.availableQuantity ?? cartItem?.availableQuantity;

    if (
      newQuantity > currentQuantity &&
      availableQuantity !== undefined &&
      availableQuantity !== null &&
      newQuantity > availableQuantity
    ) {
      toast.error(`Only ${availableQuantity} items available in stock`);
      throw new Error("Out of stock");
    }

    // 2. Optimistic Update
    if (cartItem) {
      if (newQuantity <= 0) {
        dispatch(removeItemCompletely(productId));
      } else {
        dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
      }
    } else if (newQuantity > 0 && product) {
      dispatch(addToCart(product));
      // If adding brand new and quantity > 1, update it immediately
      if (newQuantity > 1) {
        dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
      }
    }

    // 3. Analytics Tracking (Centralized)
    // First Add: item was not in cart, now it is
    if (currentQuantity === 0 && newQuantity > 0) {
      trackEvent({
        event: ANALYTICS_EVENTS.ADD_TO_CART,
        sessionId: getSessionId(),
        userId: user?.id,
        metadata: { productId, quantity: newQuantity },
      });
    }
    // Remove Completely: item was in cart, now it's gone
    else if (currentQuantity > 0 && newQuantity === 0) {
      // Logic for isEmpty: if this was the last item OR total quantity becomes 0
      // Actually, as per requirements: only fire REMOVE_FROM_CART when cart becomes empty
      // BUT requirement Case 3 says: User removes product completely -> cartsActive = 0
      // Wait, requirement 2 under Centralize Analytics says:
      // prevQuantity > 0 && newQuantity === 0 -> trackEvent("REMOVE_FROM_CART", { isEmpty: true })
      // AND Metadata: { productId, isEmpty: newQuantity === 0 }

      const newItems = (getState() as RootState).cart.items;
      const isCartNowEmpty = newItems.length === 0;

      trackEvent({
        event: ANALYTICS_EVENTS.REMOVE_FROM_CART,
        sessionId: getSessionId(),
        userId: user?.id,
        metadata: {
          productId,
          isEmpty: isCartNowEmpty,
        },
      });
    }

    if (isAuthenticated) {
      try {
        // 4. API Sync
        if (newQuantity > 0) {
          if (cartItem) {
            await cartAPI.updateCartItem(productId, newQuantity);
          } else {
            await cartAPI.addToCart(productId, newQuantity);
          }
        } else {
          await cartAPI.removeFromCart(productId);
        }
      } catch (err: unknown) {
        // 5. Rollback
        if (currentQuantity === 0) {
          dispatch(removeItemCompletely(productId));
        } else {
          dispatch(
            updateQuantity({ id: productId, quantity: currentQuantity }),
          );
        }
        const message =
          err instanceof Error ? err.message : "Failed to sync cart";
        toast.error(message);
        throw err;
      }
    }
  },
);

// Thunk to clear cart
export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    dispatch(clearCart());

    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (err: unknown) {
        console.error("Failed to sync clear", err);
        // We don't necessarily rollback clearCart as it's a destructive action,
        // but we log the error.
        const message =
          err instanceof Error ? err.message : "Failed to sync clear cart";
        toast.error(message);
      }
    }
  },
);

// Slice for cart
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => String(item.id) === String(action.payload.id),
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      recalculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => String(item.id) === String(action.payload),
      );

      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload),
        );
      } else {
        existingItem.quantity -= 1;
      }

      recalculateTotals(state);
    },

    removeItemCompletely: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload),
      );

      recalculateTotals(state);
    },

    // New reducer for direct quantity updates
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;

      const item = state.items.find((i) => String(i.id) === String(id));

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => String(i.id) !== String(id));
      } else {
        item.quantity = quantity; // direct sync with UI
      }

      recalculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
  },
});

// Actions
export const {
  addToCart,
  removeFromCart,
  removeItemCompletely,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
