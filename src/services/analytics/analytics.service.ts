import apiClient from "../apiClient";
import type { TrackEventInput } from "../../types/analytics";

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