"use client";

import React, { useState, useMemo } from "react";
import { Table, Flex, Text, Badge } from "@radix-ui/themes";
import { ProductPerformance } from "@/types/analytics";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { getProductInsights } from "@/features/analytics/utils/getProductInsights";

interface ProductAnalyticsTableProps {
  data: ProductPerformance[];
}

type SortField = keyof ProductPerformance | "conversionRatio" | "intentRatio";

export default function ProductAnalyticsTable({ data }: ProductAnalyticsTableProps) {
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const calculatedData = useMemo(() => {
    return data.map((item) => {
      const conversionRatio = item.views > 0 ? (item.purchases / item.views) * 100 : 0;
      const intentRatio = item.views > 0 ? (item.addToCart / item.views) * 100 : 0;
      const insights = getProductInsights(item);
      
      return {
        ...item,
        conversionRatio,
        intentRatio,
        insights,
      };
    });
  }, [data]);

  const sortedData = useMemo(() => {
    return [...calculatedData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle the sort field being nested in insights if we ever want to sort by them
      // But for now, stats are primary
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      const numA = Number(aValue);
      const numB = Number(bValue);

      return sortOrder === "asc" ? numA - numB : numB - numA;
    });
  }, [calculatedData, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="bg-gray-50">
            <Table.ColumnHeaderCell className="cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("productName")}>
              <Flex align="center" gap="2">
                Product Name <SortIcon field="productName" />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("views")}>
              <Flex align="center" gap="2">
                Views <SortIcon field="views" />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("addToCart")}>
              <Flex align="center" gap="2">
                Add to Cart <SortIcon field="addToCart" />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("purchases")}>
              <Flex align="center" gap="2">
                Purchases <SortIcon field="purchases" />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("conversionRatio")}>
              <Flex align="center" gap="2">
                Conv. Rate (%) <SortIcon field="conversionRatio" />
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text weight="bold">Insights</Text>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedData.map((item) => (
            <Table.Row key={item.productId} className="hover:bg-gray-50 transition-colors">
              <Table.RowHeaderCell>
                <Text weight="medium" color="gray" highContrast>
                  {item.productName || "Unknown Product"}
                </Text>
                <Text size="1" color="gray" className="block opacity-50 font-normal">
                  ID: {item.productId.slice(0, 8)}...
                </Text>
              </Table.RowHeaderCell>
              <Table.Cell>{item.views.toLocaleString()}</Table.Cell>
              <Table.Cell>{item.addToCart.toLocaleString()}</Table.Cell>
              <Table.Cell>{item.purchases.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={item.conversionRatio > 5 ? "green" : item.conversionRatio > 2 ? "blue" : "gray"}
                  variant="soft"
                >
                  {item.conversionRatio.toFixed(2)}%
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2" wrap="wrap">
                  {item.insights.isOpportunity && (
                    <Badge color="yellow" variant="solid">
                      Opportunity
                    </Badge>
                  )}
                  {item.insights.isHighIntent && (
                    <Badge color="green" variant="soft">
                      High Interest
                    </Badge>
                  )}
                  {item.insights.isLowConversion && (
                    <Badge color="red" variant="soft">
                      Low Conversion
                    </Badge>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
          {sortedData.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-10 text-gray-400">
                No analytics data found for products.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
