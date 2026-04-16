import apiClient from "../apiClient";
import type {
  LiveStats,
  TrackEventInput,
  LiveAnalyticsSubscriptionData,
} from "../../types/analytics";
import { createClient } from "graphql-ws";
import Cookies from "js-cookie";

const wsUrl = "ws://localhost:8000/graphql";

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: wsUrl,
        connectionParams: () => {
          const token = Cookies.get("auth-token");
          return {
            Authorization: token ? `Bearer ${token}` : undefined,
          };
        },
      })
    : null;

// Keep track of recent events to avoid rapid duplicates
const recentEvents = new Map<string, number>();

export const trackEvent = async (
  input: TrackEventInput,
  retries = 2,
): Promise<boolean> => {
  // Simple deduplication
  const eventHash = `${input.event}-${JSON.stringify(input.metadata)}`;
  const now = Date.now();
  if (
    recentEvents.has(eventHash) &&
    now - (recentEvents.get(eventHash) || 0) < 1000
  ) {
    // Silently drop duplicate
    return true;
  }
  recentEvents.set(eventHash, now);

  try {
    const response = await apiClient.post("", {
      query: `
        mutation TrackEvent($input: TrackEventInput!) {
          trackEvent(input: $input)
        }
      `,
      variables: {
        input,
      },
    });

    return response.data?.data?.trackEvent;
  } catch (error) {
    if (retries > 0) {
      console.warn(`TrackEvent failed, retrying... (${retries} retries left)`);
      // Simple exp backoff
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return trackEvent(input, retries - 1);
    }
    console.error("TrackEvent Error:", error);
    return false;
  }
};

export const identifyEvent = async (sessionId: string) => {
  try {
    const response = await apiClient.post("", {
      query: `
        mutation Identify($sessionId: String!) {
          identify(sessionId: $sessionId)
        }
      `,
      variables: {
        sessionId,
      },
    });

    return response.data?.data?.identify;
  } catch (error) {
    console.error("IdentifyEvent Error:", error);
    return false;
  }
};

interface LiveAnalyticsPayload {
  liveAnalytics: LiveStats;
}

export const subscribeToLiveAnalytics = (
  onNext: (data: LiveAnalyticsSubscriptionData) => void,
  onError?: (error: unknown) => void,
) => {
  if (!wsClient) return () => {};

  const unsubscribe = wsClient.subscribe<LiveAnalyticsPayload>(
    {
      query: `
        subscription LiveAnalytics {
          liveAnalytics {
            activeSessions
            cartsActive
            checkoutActive
          }
        }
      `,
    },
    {
      next: (val) => {
        if (val.data) {
          onNext(val.data as unknown as LiveAnalyticsSubscriptionData);
        }
      },
      error: (err) => onError?.(err),
      complete: () => {},
    },
  );

  return unsubscribe;
};
