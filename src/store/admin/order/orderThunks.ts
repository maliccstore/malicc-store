import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllOrders, updateOrderStatus, updateFulfillmentStatus, OrderStatus, FulfillmentStatus, OrderFilterInput } from '@/services/admin/order.admin';

export const fetchAdminOrders = createAsyncThunk(
    'adminOrders/fetchAdminOrders',
    async (filters: OrderFilterInput | undefined, { rejectWithValue }) => {
        try {
            const response = await getAllOrders(filters);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const updateAdminOrderStatus = createAsyncThunk(
    'adminOrders/updateAdminOrderStatus',
    async ({ id, status }: { id: string; status: OrderStatus }, { rejectWithValue }) => {
        try {
            const response = await updateOrderStatus(id, status);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response.order;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to update order status');
        }
    }
);

export const updateAdminFulfillmentStatus = createAsyncThunk(
    'adminOrders/updateAdminFulfillmentStatus',
    async ({ id, status }: { id: string; status: FulfillmentStatus }, { rejectWithValue }) => {
        try {
            const response = await updateFulfillmentStatus(id, status);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response.order;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to update fulfillment status');
        }
    }
);
