export interface WhatsAppCampaign {
  id: number;
  title: string;
  messageTemplate: string;
  messageType: string;
  status: string;
  totalRecipients: number;
  successfulCount: number;
  failedCount: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  customerType?: "ALL" | "NEW" | "REPEAT" | "INACTIVE";
  purchasedWithinDays?: number;
  minSpent?: number;
}

export interface SendWhatsAppCampaignInput {
  title: string;
  templateName: string;
  templateLanguage?: string;
  customerIds?: number[];
  targetAll?: boolean;
  filters?: CampaignFilters;
  productId?: string;
  bannerImage?: string;
}

export interface SendProductAnnouncementInput {
  title: string;
  templateName: string;
  productId: string; // The ID of the product
  headline: string;
  ctaUrl?: string;
  customerIds?: number[];
  targetAll?: boolean;
  filters?: CampaignFilters;
}

export interface WhatsAppCampaignResponse {
  success: boolean;
  message?: string;
  campaign?: WhatsAppCampaign;
}

export interface WhatsAppCampaignsResponse {
  success: boolean;
  message?: string;
  campaigns: WhatsAppCampaign[];
  totalCount: number;
}

export interface AudienceEstimateResponse {
  success: boolean;
  estimatedRecipients: number;
  filters: CampaignFilters;
}
