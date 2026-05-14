"use client";

import React from "react";
import { Flex, Text, Box, Badge } from "@radix-ui/themes";
import { UsageSnapshot, formatBytes } from "@/services/admin/billing.admin";

interface UsageTableProps {
  snapshots: UsageSnapshot[];
  loading?: boolean;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function UsageTable({ snapshots, loading = false }: UsageTableProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Flex align="center" justify="between">
          <Text size="3" weight="bold">
            Daily Usage History
          </Text>
          <Badge color="gray" variant="soft" radius="full">
            Last 30 days
          </Badge>
        </Flex>
      </div>

      {/* Table */}
      <Box style={{ overflowX: "auto" }}>
        <table className="w-full text-sm" id="billing-usage-table">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Storage</th>
              <th className="px-4 py-3 text-right font-medium">Bandwidth</th>
              <th className="px-4 py-3 text-right font-medium">WhatsApp Msgs</th>
              <th className="px-4 py-3 text-right font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Products</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : snapshots.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400 text-sm"
                >
                  No usage data available for this period.
                </td>
              </tr>
            ) : (
              snapshots.map((snap, idx) => (
                <tr
                  key={snap.date}
                  className={`
                    border-b border-gray-50 hover:bg-gray-50/60 transition-colors
                    ${idx === 0 ? "font-medium" : ""}
                  `}
                >
                  <td className="px-4 py-3">
                    <Flex align="center" gap="2">
                      {idx === 0 && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                      )}
                      <Text size="2">{snap.date}</Text>
                    </Flex>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text size="2" color="gray">
                      {formatBytes(snap.storageBytes)}
                    </Text>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text size="2" color="gray">
                      {formatBytes(snap.bandwidthBytes)}
                    </Text>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text size="2">{snap.whatsappMessages.toLocaleString()}</Text>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text size="2">{snap.ordersCount.toLocaleString()}</Text>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Text size="2" color="gray">
                      {snap.productCount.toLocaleString()}
                    </Text>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </div>
  );
}
