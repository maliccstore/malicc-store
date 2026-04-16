"use client";

import React, { useEffect, useState } from "react";
import { Container, Flex, Heading, Text, Box, Spinner, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { getProductAnalytics, ProductPerformance } from "@/services/admin/dashboard.admin";
import ProductAnalyticsTable from "@/components/admin/analytics/ProductAnalyticsTable";

export default function ProductAnalyticsPage() {
  const [data, setData] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await getProductAnalytics();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Failed to load product analytics", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Container size="4" p="4">
      <Box mb="6">
        <Heading size="8" mb="2">Product Performance</Heading>
        <Text color="gray">
          Track views, intent, and conversion metrics to optimize your product catalog.
        </Text>
      </Box>

      {error ? (
        <Callout.Root color="red" role="alert">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      ) : loading ? (
        <Flex align="center" justify="center" p="9">
          <Spinner size="3" />
        </Flex>
      ) : (
        <Flex direction="column" gap="4">
          <Callout.Root color="blue" variant="soft" size="1">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              This dashboard highlights products that customers "Add to Cart" often but rarely "Buy." High interest with low sales may suggest issues with pricing, shipping, or stock.
            </Callout.Text>
          </Callout.Root>
          
          <ProductAnalyticsTable data={data} />
        </Flex>
      )}
    </Container>
  );
}
