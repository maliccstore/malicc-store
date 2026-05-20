import apiClient from "../apiClient";
import axios from "axios";
import Cookies from "js-cookie";
import { HomepageConfig, Banner } from "@/types/homepage";

export const homepageAdminAPI = {
  getHomepageConfig: async (): Promise<HomepageConfig> => {
    const query = `
      query GetHomepageConfig {
        getHomepageConfig {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;
    const response = await apiClient.post("", { query });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.getHomepageConfig;
  },

  updateHomepageConfig: async (config: HomepageConfig): Promise<HomepageConfig> => {
    const query = `
      mutation UpdateHomepageConfig($input: HomepageConfigInput!) {
        updateHomepageConfig(input: $input) {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;

    // Map frontend config to input structure
    const input = {
      heroBanners: config.heroBanners.map((b: Banner) => ({
        id: b.id,
        image: b.image,
        title: b.title || "",
        subtitle: b.subtitle || "",
        ctaText: b.ctaText || "",
        redirectUrl: b.redirectUrl || "",
        active: b.active,
        order: b.order,
      })),
      featuredProducts: {
        productIds: config.featuredProducts.productIds,
        enabled: config.featuredProducts.enabled,
      },
      topSelling: {
        mode: config.topSelling.mode,
        productIds: config.topSelling.productIds,
        limit: config.topSelling.limit,
        enabled: config.topSelling.enabled,
        minimumThreshold: config.topSelling.minimumThreshold,
      },
      promotionalBanners: config.promotionalBanners.map((b: Banner) => ({
        id: b.id,
        image: b.image,
        title: b.title || "",
        subtitle: b.subtitle || "",
        ctaText: b.ctaText || "",
        redirectUrl: b.redirectUrl || "",
        active: b.active,
        order: b.order,
      })),
      newArrivals: {
        enabled: config.newArrivals.enabled,
        limit: config.newArrivals.limit,
      },
      sectionOrder: config.sectionOrder,
    };

    const response = await apiClient.post("", { query, variables: { input } });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.updateHomepageConfig;
  },

  addHomepageBanner: async (type: 'HERO' | 'PROMOTIONAL', banner: Omit<Banner, 'id' | 'order'>): Promise<HomepageConfig> => {
    const query = `
      mutation AddHomepageBanner($type: HomepageBannerType!, $input: BannerInput!) {
        addHomepageBanner(type: $type, input: $input) {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;
    const input = {
      image: banner.image,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      redirectUrl: banner.redirectUrl || "",
      active: banner.active,
      order: 0,
    };
    const response = await apiClient.post("", { query, variables: { type, input } });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.addHomepageBanner;
  },

  updateHomepageBanner: async (type: 'HERO' | 'PROMOTIONAL', id: string, banner: Partial<Banner>): Promise<HomepageConfig> => {
    const query = `
      mutation UpdateHomepageBanner($type: HomepageBannerType!, $id: String!, $input: BannerInput!) {
        updateHomepageBanner(type: $type, id: $id, input: $input) {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;
    const input = {
      image: banner.image,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      redirectUrl: banner.redirectUrl || "",
      active: banner.active,
      order: banner.order !== undefined ? banner.order : 0,
    };
    const response = await apiClient.post("", { query, variables: { type, id, input } });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.updateHomepageBanner;
  },

  deleteHomepageBanner: async (type: 'HERO' | 'PROMOTIONAL', id: string): Promise<HomepageConfig> => {
    const query = `
      mutation DeleteHomepageBanner($type: HomepageBannerType!, $id: String!) {
        deleteHomepageBanner(type: $type, id: $id) {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;
    const response = await apiClient.post("", { query, variables: { type, id } });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.deleteHomepageBanner;
  },

  reorderHomepageBanners: async (type: 'HERO' | 'PROMOTIONAL', order: string[]): Promise<HomepageConfig> => {
    const query = `
      mutation ReorderHomepageBanners($type: HomepageBannerType!, $order: [String!]!) {
        reorderHomepageBanners(type: $type, order: $order) {
          heroBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          featuredProducts {
            productIds
            enabled
          }
          topSelling {
            mode
            productIds
            limit
            enabled
            minimumThreshold
          }
          promotionalBanners {
            id
            image
            title
            subtitle
            ctaText
            redirectUrl
            active
            order
          }
          newArrivals {
            enabled
            limit
          }
          sectionOrder
        }
      }
    `;
    const response = await apiClient.post("", { query, variables: { type, order } });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.reorderHomepageBanners;
  },

  uploadHomepageBanner: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = Cookies.get("auth-token");
    const baseurl = process.env.NEXT_PUBLIC_REST_API_URL;
    const response = await axios.post(
      `${baseurl}/admin/uploads/homepage-banner`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      }
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data.url;
    }

    throw new Error("Upload failed or returned invalid response");
  },
};
