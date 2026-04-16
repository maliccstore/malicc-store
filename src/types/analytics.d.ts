export type TrackEventInput = {
  event: string;
  sessionId: string;
  userId?: number | string;
  metadata?: Record<string, unknown>;
};

export interface LiveStats {
  activeSessions: number;
  cartsActive: number;
  checkoutActive: number;
}

export interface LiveAnalyticsSubscriptionData {
  liveAnalytics: LiveStats;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  views: number;
  addToCart: number;
  purchases: number;
}

export interface FunnelStep {
  step: string;
  count: number;
  dropOff: number;
  conversionRate: number;
}
