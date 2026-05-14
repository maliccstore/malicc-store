import { createSlice } from '@reduxjs/toolkit';
import { WhatsAppCampaign } from '@/features/admin/marketing/marketing.types';
import {
  fetchWhatsAppCampaigns,
  sendPromotionalWhatsApp,
  sendProductAnnouncement,
} from './marketingThunks';

interface MarketingState {
  campaigns: WhatsAppCampaign[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  sendStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MarketingState = {
  campaigns: [],
  totalCount: 0,
  loading: false,
  error: null,
  sendStatus: 'idle',
};

const marketingSlice = createSlice({
  name: 'admin/marketing',
  initialState,
  reducers: {
    resetSendStatus: (state) => {
      state.sendStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Campaigns
    builder.addCase(fetchWhatsAppCampaigns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWhatsAppCampaigns.fulfilled, (state, action) => {
      state.loading = false;
      state.campaigns = action.payload.campaigns || [];
      state.totalCount = action.payload.totalCount || 0;
    });
    builder.addCase(fetchWhatsAppCampaigns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Send Promotional
    builder.addCase(sendPromotionalWhatsApp.pending, (state) => {
      state.sendStatus = 'loading';
      state.error = null;
    });
    builder.addCase(sendPromotionalWhatsApp.fulfilled, (state, action) => {
      state.sendStatus = 'success';
      if (action.payload.campaign) {
        state.campaigns.unshift(action.payload.campaign);
      }
    });
    builder.addCase(sendPromotionalWhatsApp.rejected, (state, action) => {
      state.sendStatus = 'error';
      state.error = action.payload as string;
    });

    // Send Product Announcement
    builder.addCase(sendProductAnnouncement.pending, (state) => {
      state.sendStatus = 'loading';
      state.error = null;
    });
    builder.addCase(sendProductAnnouncement.fulfilled, (state, action) => {
      state.sendStatus = 'success';
      if (action.payload.campaign) {
        state.campaigns.unshift(action.payload.campaign);
      }
    });
    builder.addCase(sendProductAnnouncement.rejected, (state, action) => {
      state.sendStatus = 'error';
      state.error = action.payload as string;
    });
  },
});

export const { resetSendStatus } = marketingSlice.actions;
export default marketingSlice.reducer;
