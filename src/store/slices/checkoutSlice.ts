// src/store/slices/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  selectedAddressId: string | null;
  totalQuantity: number;
  totalAmount: number;
  couponCode: string | null;
  discountAmount: number;
  originalSubtotal: number;
  couponStatus: 'idle' | 'loading' | 'success' | 'error';
  couponError: string | null;
}

const initialState: CheckoutState = {
  selectedAddressId: null,
  totalQuantity: 0,
  totalAmount: 0,
  couponCode: null,
  discountAmount: 0,
  originalSubtotal: 0,
  couponStatus: 'idle',
  couponError: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedAddressId: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
    },
    setOriginalSubtotal: (state, action: PayloadAction<number>) => {
      state.originalSubtotal = action.payload;
    },
    setCartTotals: (
      state,
      action: PayloadAction<{ totalQuantity: number; totalAmount: number }>
    ) => {
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
    applyCouponSuccess: (
      state,
      action: PayloadAction<{ couponCode: string; discountAmount: number }>
    ) => {
      state.couponCode = action.payload.couponCode;
      state.discountAmount = action.payload.discountAmount;
      state.couponStatus = 'success';
      state.couponError = null;
    },
    applyCouponError: (state, action: PayloadAction<string>) => {
      state.couponStatus = 'error';
      state.couponError = action.payload;
      state.couponCode = null;
      state.discountAmount = 0;
    },
    clearCoupon: (state) => {
      state.couponCode = null;
      state.discountAmount = 0;
      state.couponStatus = 'idle';
      state.couponError = null;
    },
    clearCheckoutState: (state) => {
      state.selectedAddressId = null;
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.couponCode = null;
      state.discountAmount = 0;
      state.originalSubtotal = 0;
      state.couponStatus = 'idle';
      state.couponError = null;
    },
  },
});

export const {
  setSelectedAddressId,
  setCartTotals,
  applyCouponSuccess,
  applyCouponError,
  clearCoupon,
  clearCheckoutState,
  setOriginalSubtotal,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
