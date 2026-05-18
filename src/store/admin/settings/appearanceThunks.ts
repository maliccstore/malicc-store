import { createAsyncThunk } from '@reduxjs/toolkit';
import { appearanceAdminAPI } from '@/services/admin/appearance.admin';
import { StoreAppearance } from '@/types/appearance';

export const fetchAppearance = createAsyncThunk(
  'appearance/fetch',
  async () => {
    const res = await appearanceAdminAPI.getAppearance();
    return res.data;
  }
);

export const updateAppearance = createAsyncThunk(
  'appearance/update',
  async (data: Partial<StoreAppearance>) => {
    const res = await appearanceAdminAPI.updateAppearance(data);
    return res.data;
  }
);

export const uploadLogo = createAsyncThunk(
  'appearance/uploadLogo',
  async (file: File) => {
    const res = await appearanceAdminAPI.uploadLogo(file);
    return res.logo_url;
  }
);

export const deleteLogo = createAsyncThunk(
  'appearance/deleteLogo',
  async () => {
    await appearanceAdminAPI.deleteLogo();
    return null;
  }
);
