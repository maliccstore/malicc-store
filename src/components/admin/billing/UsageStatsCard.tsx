"use client";

import React from "react";
import { Flex, Text } from "@radix-ui/themes";

interface UsageStatsCardProps {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  accentColor: string; // Tailwind colour class e.g. "blue", "violet"
  loading?: boolean;
}

const GLOW_COLORS: Record<string, string> = {
  blue: "shadow-blue-200",
  violet: "shadow-violet-200",
  green: "shadow-green-200",
  orange: "shadow-orange-200",
  red: "shadow-red-200",
  amber: "shadow-amber-200",
};

const BG_COLORS: Record<string, string> = {
  blue: "bg-blue-50",
  violet: "bg-violet-50",
  green: "bg-green-50",
  orange: "bg-orange-50",
  red: "bg-red-50",
  amber: "bg-amber-50",
};

const ICON_COLORS: Record<string, string> = {
  blue: "text-blue-600",
  violet: "text-violet-600",
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
  amber: "text-amber-600",
};

export default function UsageStatsCard({
  id,
  label,
  value,
  icon,
  accentColor,
  loading = false,
}: UsageStatsCardProps) {
  const glow = GLOW_COLORS[accentColor] ?? GLOW_COLORS.blue;
  const bg = BG_COLORS[accentColor] ?? BG_COLORS.blue;
  const iconColor = ICON_COLORS[accentColor] ?? ICON_COLORS.blue;

  return (
    <div
      id={id}
      className={`
        rounded-2xl border border-gray-100 bg-white p-5
        shadow-md hover:shadow-lg ${glow}
        transition-all duration-300 hover:-translate-y-0.5
      `}
    >
      <Flex direction="column" gap="3">
        {/* Header */}
        <Flex align="center" gap="2">
          <div className={`p-2 rounded-xl ${bg}`}>
            <span className={`${iconColor} w-5 h-5 block`}>{icon}</span>
          </div>
          <Text size="2" weight="medium" color="gray">
            {label}
          </Text>
        </Flex>

        {/* Value */}
        {loading ? (
          <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <Text
            size="7"
            weight="bold"
            style={{ lineHeight: 1 }}
          >
            {value}
          </Text>
        )}
      </Flex>
    </div>
  );
}
