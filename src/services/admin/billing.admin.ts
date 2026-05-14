// src/services/admin/billing.admin.ts
import axios from "axios";

const hqClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HQ_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UsageSnapshot {
  date: string;
  storageBytes: string;
  bandwidthBytes: string;
  whatsappMessages: number;
  ordersCount: number;
  productCount: number;
  receivedAt: string | null;
  updatedAt: string;
}

export interface UsageSummary {
  totalStorageBytes: string;
  totalBandwidthBytes: string;
  totalWhatsappMessages: number;
  totalOrdersCount: number;
  daysReported: number;
}

export interface SnapshotsResponse {
  status: string;
  storeId: string;
  days: number;
  count: number;
  snapshots: UsageSnapshot[];
}

export interface SummaryResponse {
  status: string;
  storeId: string;
  from: string;
  to: string;
  summary: UsageSummary;
}

// Soft plan limits — not enforced, just displayed for UX awareness.
export interface PlanLimits {
  storageBytes: number;      // 5 GB
  bandwidthBytes: number;    // 50 GB
  whatsappMessages: number;  // 500 / month
  ordersCount: number;       // 1000 / month
}

export const DEFAULT_PLAN_LIMITS: PlanLimits = {
  storageBytes: 5 * 1024 * 1024 * 1024,       // 5 GB
  bandwidthBytes: 50 * 1024 * 1024 * 1024,    // 50 GB
  whatsappMessages: 500,
  ordersCount: 1000,
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Fetches the last N days of raw daily snapshots for a store.
 */
export async function getUsageSnapshots(
  storeId: string,
  days = 30
): Promise<SnapshotsResponse> {
  const res = await hqClient.get(
    `/api/admin/usage/snapshots?storeId=${encodeURIComponent(storeId)}&days=${days}&t=${Date.now()}`
  );
  return res.data;
}

/**
 * Fetches aggregated usage totals for a billing period.
 * Defaults to the current calendar month.
 */
export async function getUsageSummary(
  storeId: string,
  from?: string,
  to?: string
): Promise<SummaryResponse> {
  // Default: current month
  const now = new Date();
  const fromDate =
    from ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const toDate =
    to ??
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

  const res = await hqClient.get(
    `/api/admin/usage/summary?storeId=${encodeURIComponent(storeId)}&from=${fromDate}&to=${toDate}&t=${Date.now()}`
  );
  return res.data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Converts bytes (as string from Postgres BIGINT) to a human-readable label. */
export function formatBytes(bytes: string | number): string {
  const n = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(n) || n === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/** Returns 0–100 progress percentage capped at 100. */
export function usagePercent(used: string | number, limit: number): number {
  const n = typeof used === "string" ? parseInt(used, 10) : used;
  if (isNaN(n) || limit === 0) return 0;
  return Math.min(100, Math.round((n / limit) * 100));
}
