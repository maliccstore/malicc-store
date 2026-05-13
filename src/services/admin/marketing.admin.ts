import apiClient from "@/services/apiClient";
import {
  SendWhatsAppCampaignInput,
  SendProductAnnouncementInput,
  WhatsAppCampaignsResponse,
  WhatsAppCampaignResponse,
  AudienceEstimateResponse,
  CampaignFilters,
} from "@/features/admin/marketing/marketing.types";

export const marketingAdminAPI = {
  sendPromotionalWhatsApp: async (
    input: SendWhatsAppCampaignInput,
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
            productId
            bannerImageUrl
            headline
            offerMessage
            ctaUrl
            couponCode
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post("", {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminSendPromotionalWhatsApp;
  },

  sendProductAnnouncement: async (
    input: SendProductAnnouncementInput,
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
            productId
            bannerImageUrl
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post("", {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminSendProductAnnouncement;
  },

  fetchWhatsAppCampaigns: async (
    status?: string,
  ): Promise<WhatsAppCampaignsResponse> => {
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
            productId
            bannerImageUrl
            headline
            offerMessage
            ctaUrl
            couponCode
            createdAt
            updatedAt
          }
        }
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { filter: { status } },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.adminGetWhatsAppCampaigns;
  },

  estimateAudience: async (
    filters: CampaignFilters,
  ): Promise<AudienceEstimateResponse> => {
    // Construct the REST URL. apiClient might be configured for /graphql,
    // so we use the NEXT_PUBLIC_REST_API_URL or remove /graphql from current baseURL
    const restBaseUrl = process.env.NEXT_PUBLIC_REST_API_URL || "";
    const endpoint = `${restBaseUrl}/api/whatsapp/campaigns/audience/estimate`;

    const response = await apiClient.post(endpoint, filters);
    return response.data;
  },

  uploadCampaignBanner: async (
    file: File,
  ): Promise<{
    success: boolean;
    data?: { url: string; filename: string };
    message?: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);

    const restBaseUrl = process.env.NEXT_PUBLIC_REST_API_URL || "";
    const endpoint = `${restBaseUrl}/admin/uploads/campaign-banner`;

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
