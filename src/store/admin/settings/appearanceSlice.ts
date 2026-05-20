import { createSlice } from '@reduxjs/toolkit';
import { StoreAppearance } from '@/types/appearance';
import {
  fetchAppearance,
  updateAppearance,
  uploadLogo,
  deleteLogo,
} from './appearanceThunks';

interface AppearanceState {
  settings: StoreAppearance | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppearanceState = {
  settings: null,
  loading: false,
  error: null,
};

const appearanceSlice = createSlice({
  name: 'appearance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppearance.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appearance';
      })
      .addCase(updateAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppearance.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload } as StoreAppearance;
      })
      .addCase(updateAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update appearance';
      })
      .addCase(uploadLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.logo_url = action.payload;
        }
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload logo';
      })
      .addCase(deleteLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLogo.fulfilled, (state) => {
        state.loading = false;
        if (state.settings) {
          state.settings.logo_url = null;
        }
      })
      .addCase(deleteLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete logo';
      });
  },
});

export default appearanceSlice.reducer;
