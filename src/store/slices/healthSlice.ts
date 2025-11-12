import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HealthStatus, healthAPI } from '../service/healthAPI.service';

interface HealthState {
  status: HealthStatus | null;
  loading: boolean;
  error: string | null;
  lastChecked: string | null;
}

const initialState: HealthState = {
  status: null,
  loading: false,
  error: null,
  lastChecked: null,
};

export const checkHealth = createAsyncThunk(
  'health/checkHealth',
  async (_, { rejectWithValue }) => {
    try {
      return await healthAPI.checkHealth();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const pingServer = createAsyncThunk(
  'health/ping',
  async (_, { rejectWithValue }) => {
    try {
      return await healthAPI.ping();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearHealthError: (state) => {
      state.error = null;
    },
    resetHealth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Check Health
      .addCase(checkHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.lastChecked = new Date().toISOString();
        state.error = null;
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = null;
      })
      // Ping
      .addCase(pingServer.fulfilled, (state) => {
        state.lastChecked = new Date().toISOString();
      });
  },
});

export const { clearHealthError, resetHealth } = healthSlice.actions;
export default healthSlice.reducer;
