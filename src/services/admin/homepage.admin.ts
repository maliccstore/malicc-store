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
