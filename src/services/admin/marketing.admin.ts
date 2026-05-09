import apiClient from '@/services/apiClient';
import {
  SendWhatsAppCampaignInput,
  SendProductAnnouncementInput,
  WhatsAppCampaignsResponse,
  WhatsAppCampaignResponse,
} from '@/features/admin/marketing/marketing.types';

export const marketingAdminAPI = {
  sendPromotionalWhatsApp: async (
    input: SendWhatsAppCampaignInput
  ): Promise<WhatsAppCampaignResponse> => {
    const mutation = `
      mutation AdminSendPromotionalWhatsApp($input: SendWhatsAppCampaignInput!) {
        adminSendPromotionalWhatsApp(input: $input) {
          success
          message
          campaign {
            id
            title
            messageTemplate
            messageType
            status
            totalRecipients
            successfulCount
            failedCount
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post('', {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminSendPromotionalWhatsApp;
  },

  sendProductAnnouncement: async (
    input: SendProductAnnouncementInput
  ): Promise<WhatsAppCampaignResponse> => {
    const mutation = `
      mutation AdminSendProductAnnouncement($input: SendProductAnnouncementInput!) {
        adminSendProductAnnouncement(input: $input) {
          success
          message
          campaign {
            id
            title
            messageTemplate
            messageType
            status
            totalRecipients
            successfulCount
            failedCount
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post('', {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminSendProductAnnouncement;
  },

  fetchWhatsAppCampaigns: async (status?: string): Promise<WhatsAppCampaignsResponse> => {
    const query = `
      query AdminGetWhatsAppCampaigns($filter: CampaignFilterInput) {
        adminGetWhatsAppCampaigns(filter: $filter) {
          success
          message
          totalCount
          campaigns {
            id
            title
            messageTemplate
            messageType
            status
            totalRecipients
            successfulCount
            failedCount
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post('', {
      query,
      variables: { filter: { status } },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminGetWhatsAppCampaigns;
  },
};
