import { createSlice } from '@reduxjs/toolkit';
import { fetchAdminOrders, updateAdminOrderStatus } from './orderThunks';
import { OrderStatus } from '@/services/admin/order.admin';

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
}

interface Order {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    currency: string;
    createdAt: string;
    shippingAddress: {
        fullName: string;
    };
    items: OrderItem[];
}

interface OrderState {
    list: Order[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    list: [],
    totalCount: 0,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.orders;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Order Status
            .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
                const index = state.list.findIndex((order) => order.id === action.payload.id);
                if (index !== -1) {
                    state.list[index].status = action.payload.status;
                }
            });
    },
});

export default orderSlice.reducer;
