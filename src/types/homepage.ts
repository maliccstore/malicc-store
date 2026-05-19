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

export interface FeaturedProductsConfig {
  productIds: string[];
  enabled: boolean;
}

export interface TopSellingConfig {
  mode: 'AUTO' | 'MANUAL';
  productIds: string[];
  limit: number;
  enabled: boolean;
  minimumThreshold: number;
}

export interface NewArrivalsConfig {
  enabled: boolean;
  limit: number;
}

export interface HomepageConfig {
  heroBanners: Banner[];
  promotionalBanners: Banner[];
  featuredProducts: FeaturedProductsConfig;
  topSelling: TopSellingConfig;
  newArrivals: NewArrivalsConfig;
  sectionOrder: string[];
}

export interface StorefrontHomepagePayload {
  config: HomepageConfig;
  featuredProducts: Product[];
  topSellingProducts: Product[];
  newArrivals: Product[];
}
