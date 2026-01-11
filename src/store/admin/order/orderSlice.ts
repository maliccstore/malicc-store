import { createSlice } from '@reduxjs/toolkit';

interface OrderState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    list: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {},
});

export default orderSlice.reducer;
