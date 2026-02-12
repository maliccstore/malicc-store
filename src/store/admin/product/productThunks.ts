import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminProductAPI } from '@/services/admin/product.admin';
import { AdminProduct } from '@/features/admin/products/product.types';

export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async () => {
    const res = await adminProductAPI.getAll();
    return res.data;
  }
);

export const fetchAdminProductById = createAsyncThunk(
  'adminProducts/fetchById',
  async (id: string) => {
    const res = await adminProductAPI.getById(id);
    return res.data;
  }
);

export const createAdminProduct = createAsyncThunk(
  'adminProducts/create',
  async (data: Partial<AdminProduct>) => {
    const res = await adminProductAPI.create(data);
    return res.data;
  }
);

export const updateAdminProduct = createAsyncThunk(
  'adminProducts/update',
  async ({ id, data }: { id: string; data: Partial<AdminProduct> }) => {
    const res = await adminProductAPI.update(id, data);
    return res.data;
  }
);

export const deleteAdminProduct = createAsyncThunk(
  'adminProducts/delete',
  async (id: string) => {
    await adminProductAPI.delete(id);
    return id;
  }
);
