import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
    selectedAddressId: string | null;
}

const initialState: CheckoutState = {
    selectedAddressId: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setSelectedAddressId: (state, action: PayloadAction<string | null>) => {
            state.selectedAddressId = action.payload;
        },
        clearCheckoutState: (state) => {
            state.selectedAddressId = null;
        },
    },
});

export const { setSelectedAddressId, clearCheckoutState } = checkoutSlice.actions;

export default checkoutSlice.reducer;
