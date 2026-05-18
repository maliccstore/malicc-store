import { StorefrontHomepagePayload } from "../../types/homepage";

export const getDefaultHomepageConfig = (): StorefrontHomepagePayload => {
  return {
    config: {
      sectionOrder: ["hero", "featured", "topSelling", "promotional", "newArrivals"],
      heroBanners: [],
      promotionalBanners: [],
      featuredProducts: {
        enabled: true,
        productIds: [],
      },
      topSelling: {
        mode: "AUTO",
        limit: 10,
        enabled: true,
      },
      newArrivals: {
        enabled: true,
        limit: 10,
      },
    },
    featuredProducts: [],
    topSellingProducts: [],
    newArrivals: [],
  };
};
