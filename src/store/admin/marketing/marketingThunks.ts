import { createAsyncThunk } from '@reduxjs/toolkit';
import { marketingAdminAPI } from '@/services/admin/marketing.admin';
import {
  SendWhatsAppCampaignInput,
  SendProductAnnouncementInput,
} from '@/features/admin/marketing/marketing.types';

export const fetchWhatsAppCampaigns = createAsyncThunk(
  'admin/marketing/fetchWhatsAppCampaigns',
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const response = await marketingAdminAPI.fetchWhatsAppCampaigns(status);
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to fetch campaigns');
    }
  }
);

export const sendPromotionalWhatsApp = createAsyncThunk(
  'admin/marketing/sendPromotionalWhatsApp',
  async (input: SendWhatsAppCampaignInput, { rejectWithValue }) => {
    try {
      const response = await marketingAdminAPI.sendPromotionalWhatsApp(input);
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to send promotional campaign');
    }
  }
);

export const sendProductAnnouncement = createAsyncThunk(
  'admin/marketing/sendProductAnnouncement',
  async (input: SendProductAnnouncementInput, { rejectWithValue }) => {
    try {
      const response = await marketingAdminAPI.sendProductAnnouncement(input);
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to send product announcement');
    }
  }
);
