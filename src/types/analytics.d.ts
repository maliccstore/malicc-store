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