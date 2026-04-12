import apiClient from "../apiClient";
import type { TrackEventInput } from "../../types/analytics";

export const trackEvent = async (input: TrackEventInput) => {
  try {
    const response = await apiClient.post("/graphql", {
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