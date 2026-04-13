import apiClient from "../apiClient";
import type { TrackEventInput } from "../../types/analytics";
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';

const wsUrl = 'ws://localhost:8000/graphql';

export const wsClient = typeof window !== 'undefined'
  ? createClient({
      url: wsUrl,
      connectionParams: () => {
        const token = Cookies.get('auth-token');
        return {
          Authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    })
  : null;

export const trackEvent = async (input: TrackEventInput) => {
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

export const subscribeToLiveAnalytics = (
  onNext: (data: any) => void,
  onError?: (error: any) => void
) => {
  if (!wsClient) return () => {};

  const unsubscribe = wsClient.subscribe(
    {
      query: `
        subscription LiveAnalytics {
          liveAnalytics {
            activeUsers
            cartsActive
            orders
          }
        }
      `,
    },
    {
      next: (val) => onNext(val.data),
      error: (err) => onError?.(err),
      complete: () => {},
    }
  );

  return unsubscribe;
};