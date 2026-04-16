"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  trackEvent,
  subscribeToLiveAnalytics,
} from "@/services/analytics/analytics.service";
import { getSessionId } from "@/services/analytics/session";
import { setLiveStats } from "@/store/admin/dashboard/dashboardSlice";
import { ANALYTICS_EVENTS } from "@/constants/event-constants";

export function AnalyticsTracker() {
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionId = getSessionId();

    // 🔥 SESSION START
    trackEvent({
      event: ANALYTICS_EVENTS.SESSION_START,
      sessionId,
    });

    // 🔥 SUBSCRIBE ONLY (no initial fetch)
    const unsubscribe = subscribeToLiveAnalytics(
      (data) => {
        if (data?.liveAnalytics) {
          dispatch(setLiveStats(data.liveAnalytics));
        }
      },
      (error) => {
        console.error("Live analytics error:", error);
      },
    );

    // 🔥 SESSION END (reliable)
    const handleUnload = () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/graphql";

      const payload = JSON.stringify({
        query: `
          mutation TrackEvent($input: TrackEventInput!) {
            trackEvent(input: $input)
          }
        `,
        variables: {
          input: {
            event: ANALYTICS_EVENTS.SESSION_END,
            sessionId,
          },
        },
      });

      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], {
            type: "application/json",
          });
          navigator.sendBeacon(apiUrl, blob);
        } else {
          fetch(apiUrl, {
            method: "POST",
            body: payload,
            headers: {
              "Content-Type": "application/json",
            },
            keepalive: true,
            credentials: "include",
          });
        }
      } catch (err) {
        console.error("Failed to send session end event", err);
      }
    };

    window.addEventListener("pagehide", handleUnload);

    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [dispatch]);

  return null;
}
