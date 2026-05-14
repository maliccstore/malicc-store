"use client";

import React from "react";
import { Flex, Text, Box, Separator } from "@radix-ui/themes";
import {
  ArchiveIcon,
  ChatBubbleIcon,
  LightningBoltIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import {
  UsageSummary,
  formatBytes,
} from "@/services/admin/billing.admin";
import UsageStatsCard from "./UsageStatsCard";

interface BillingOverviewProps {
  summary: UsageSummary | null;
  storeId: string;
  billingPeriod: { from: string; to: string };
  loading?: boolean;
}

export default function BillingOverview({
  summary,
  storeId,
  billingPeriod,
  loading = false,
}: BillingOverviewProps) {
  const storage = summary?.totalStorageBytes ?? "0";
  const bandwidth = summary?.totalBandwidthBytes ?? "0";
  const whatsapp = summary?.totalWhatsappMessages ?? 0;
  const orders = summary?.totalOrdersCount ?? 0;
  const daysReported = summary?.daysReported ?? 0;

  const cards = [
    {
      id: "billing-card-storage",
      label: "Storage Used",
      value: formatBytes(storage),
      icon: <ArchiveIcon width={18} height={18} />,
      accentColor: "blue",
    },
    {
      id: "billing-card-bandwidth",
      label: "Bandwidth",
      value: formatBytes(bandwidth),
      icon: <LightningBoltIcon width={18} height={18} />,
      accentColor: "violet",
    },
    {
      id: "billing-card-whatsapp",
      label: "WhatsApp Messages",
      value: whatsapp.toLocaleString(),
      icon: <ChatBubbleIcon width={18} height={18} />,
      accentColor: "green",
    },
    {
      id: "billing-card-orders",
      label: "Orders This Month",
      value: orders.toLocaleString(),
      icon: <ActivityLogIcon width={18} height={18} />,
      accentColor: "orange",
    },
  ];

  return (
    <Flex direction="column" gap="5">
      {/* Period banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-5 text-white shadow-lg">
        <Flex align="center" justify="between" wrap="wrap" gap="3">
          <Flex direction="column" gap="1">
            <Text size="1" style={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Billing Period
            </Text>
            <Text size="4" weight="bold">
              {billingPeriod.from} → {billingPeriod.to}
            </Text>
            <Text size="1" style={{ opacity: 0.75 }}>
              Store ID: {storeId} · {daysReported} day{daysReported !== 1 ? "s" : ""} of data
            </Text>
          </Flex>
        </Flex>
      </div>

      {/* Stats grid — Forced single column for mobile-first feel */}
      <div className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <UsageStatsCard
            key={card.id}
            {...card}
            loading={loading}
          />
        ))}
      </div>

      {/* Info note */}
      <Box>
        <Separator size="4" />
        <Flex align="center" gap="2" mt="3">
          <Text size="1" color="gray">
            Usage data is synced from your store in real-time.
            Billing calculations are handled by Malicc HQ.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
