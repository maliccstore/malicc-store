import { createSlice } from '@reduxjs/toolkit';
import { AdminUser } from '@/features/admin/users/users.types';
import { fetchAdminUsers } from './userThunks';

interface UsersState {
    list: AdminUser[];
    loading: boolean;
    error?: string;
}

const initialState: UsersState = {
    list: [],
    loading: false,
};

const usersSlice = createSlice({
    name: 'adminUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.error('Failed to fetch users:', action.error);
            });
    },
});

export default usersSlice.reducer;
