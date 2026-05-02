import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LiveStats } from '@/types/analytics';

interface DashboardState {
  liveStats: LiveStats;
}

const initialState: DashboardState = {
  liveStats: {
    activeSessions: 0,
    cartsActive: 0,
    checkoutActive: 0,
    todayVisitors: 0,
  },
};

const dashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setLiveStats: (state, action: PayloadAction<LiveStats>) => {
      state.liveStats = action.payload;
    },
  },
});

export const { setLiveStats } = dashboardSlice.actions;

export default dashboardSlice.reducer;
