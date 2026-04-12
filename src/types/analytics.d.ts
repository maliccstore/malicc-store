export type TrackEventInput = {
    event: string;
    sessionId: string;
    userId?: number | string;
    metadata?: Record<string, any>;
};