import { ProductPerformance } from "@/services/admin/dashboard.admin";

export interface ProductInsights {
  isHighIntent: boolean;
  isLowConversion: boolean;
  isOpportunity: boolean;
}

/**
 * Computes UI insight labels for product analytics.
 * Logic is isolated to keep the component lightweight and maintainable.
 */
export const getProductInsights = (product: ProductPerformance): ProductInsights => {
  const { views, addToCart, purchases } = product;
  
  // Safe calculation for ratios
  const intentRatio = views > 0 ? addToCart / views : 0;
  const conversionRate = views > 0 ? (purchases / views) * 100 : 0;

  // Thresholds
  const isHighIntent = intentRatio > 0.1; // > 10%
  const isLowConversion = conversionRate < 2; // < 2%
  const isOpportunity = isHighIntent && isLowConversion;

  return {
    isHighIntent,
    isLowConversion,
    isOpportunity,
  };
};
