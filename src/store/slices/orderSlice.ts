import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '@/services/orderAPI';
import { OrderDetail } from '@/types/orders';

interface OrderState {
    orders: OrderDetail[];
    currentOrder: OrderDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

// Async thunk for fetching all orders
export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.myOrders();
            if (response.success) {
                return response.orders;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch orders');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for fetching single order details
export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchOrderDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getOrder(id);
            if (response.success) {
                return response.order;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch order details');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order details';
            return rejectWithValue(errorMessage);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.error = null;
        },
        clearOrdersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchMyOrders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchOrderDetails
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.currentOrder = null;
            });
    },
});

export const { clearCurrentOrder, clearOrdersError } = orderSlice.actions;

export default orderSlice.reducer;
