"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Text,
  Callout,
  Button,
  Box,
} from "@radix-ui/themes";
import { InfoCircledIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  getUsageSummary,
  getUsageSnapshots,
  UsageSummary,
  UsageSnapshot,
} from "@/services/admin/billing.admin";
import BillingOverview from "@/components/admin/billing/BillingOverview";
import UsageTable from "@/components/admin/billing/UsageTable";

// Fallback store ID — in production this would come from auth context / store config
const STORE_ID =
  process.env.NEXT_PUBLIC_STORE_ID ?? "malicc_dev_001";

function getBillingPeriod() {
  const now = new Date();
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
  return { from, to };
}

export default function BillingUsagePage() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [snapshots, setSnapshots] = useState<UsageSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const period = getBillingPeriod();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, snapshotsRes] = await Promise.all([
        getUsageSummary(STORE_ID, period.from, period.to),
        getUsageSnapshots(STORE_ID, 30),
      ]);

      setSummary(summaryRes.summary);
      setSnapshots(snapshotsRes.snapshots);
      setLastRefresh(new Date());
    } catch (err: unknown) {
      console.error("Billing fetch error:", err);
      setError(
        "Failed to load billing data. Make sure Malicc HQ is running on port 3001."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="6">
        {/* Page header */}
        <Flex align="start" justify="between" wrap="wrap" gap="3">
          <Box>
            <Heading size="8" mb="1">
              Billing & Usage
            </Heading>
            <Text color="gray" size="2">
              Monitor your store&apos;s resource consumption for the current billing period.
            </Text>
          </Box>
          <Flex align="center" gap="3">
            <Text size="1" color="gray">
              Updated {lastRefresh.toLocaleTimeString()}
            </Text>
            <Button
              id="billing-refresh-btn"
              variant="soft"
              onClick={fetchData}
              disabled={loading}
            >
              <UpdateIcon />
              Refresh
            </Button>
          </Flex>
        </Flex>

        {/* Error state */}
        {error && (
          <Callout.Root color="red" role="alert" id="billing-error-callout">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {/* Billing overview cards — always render (shows skeleton when loading) */}
        <BillingOverview
          summary={summary}
          storeId={STORE_ID}
          billingPeriod={period}
          loading={loading}
        />

        {/* Daily history table */}
        <UsageTable snapshots={snapshots} loading={loading} />
      </Flex>
    </Container>
  );
}
