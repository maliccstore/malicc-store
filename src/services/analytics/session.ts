const SESSION_KEY = "analytics_session_id";

const generateSessionId = (): string => {
  // modern browsers
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // fallback
  return "sess_" + Math.random().toString(36).substring(2) + Date.now();
};

export const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};