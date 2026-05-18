import { Product } from "./product";

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  redirectUrl?: string;
  order: number;
  active: boolean;
}

export interface StorefrontHomepagePayload {
  config: {
    sectionOrder: string[];
    featuredProducts: { enabled: boolean; productIds?: string[] };
    topSelling: { enabled: boolean; mode: string; limit: number };
    newArrivals: { enabled: boolean; limit: number };
    heroBanners: Banner[];
    promotionalBanners: Banner[];
  };
  featuredProducts: Product[];
  topSellingProducts: Product[];
  newArrivals: Product[];
}
