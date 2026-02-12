import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminUserAPI } from '@/services/admin/user.admin';

// Thunk to fetch all users
export const fetchAdminUsers = createAsyncThunk(
    'adminUsers/fetchAll',
    async () => {
        const res = await adminUserAPI.getAll();
        return res.data;
    }
);
