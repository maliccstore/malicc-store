"use client";

import React, { useEffect, useState } from "react";
import { Container, Flex, Heading, Text, Box, Spinner, Callout, Grid, Card, Button } from "@radix-ui/themes";
import { InfoCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { getAnalyticsFunnel } from "@/services/admin/dashboard.admin";
import { FunnelStep } from "@/types/analytics";
import AnalyticsFunnel from "@/components/admin/analytics/AnalyticsFunnel";
import Link from "next/link";

export default function StoreAnalyticsPage() {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsFunnel();
        setFunnelData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load funnel data", err);
        setError("Failed to load conversion funnel. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFunnel();
  }, []);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="8" mb="2">Store Analytics</Heading>
          <Text color="gray">
            Understand your storefront performance and customer conversion paths.
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
          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            {/* Funnel Column */}
            <Box>
              <AnalyticsFunnel data={funnelData} />
            </Box>

            {/* Quick Links / Insights Column */}
            <Flex direction="column" gap="4">
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Heading size="4">Deeper Insights</Heading>
                  <Text size="2" color="gray">
                    Analyze performance at the individual product level to identify high-intent items with low conversion.
                  </Text>
                  <Box mt="2">
                    <Link href="/admin/analytics/products">
                      <Button variant="soft" className="cursor-pointer">
                        View Product Performance <ArrowRightIcon />
                      </Button>
                    </Link>
                  </Box>
                </Flex>
              </Card>

              <Card size="3" variant="surface">
                <Flex direction="column" gap="2">
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: 'uppercase' }}>
                    Actionable Tip
                  </Text>
                  <Text size="2">
                    If you see a large drop-off between <strong>Discovery</strong> and <strong>Intent</strong>, consider improving your product images or simplifying your category navigation.
                  </Text>
                </Flex>
              </Card>
            </Flex>
          </Grid>
        )}
      </Flex>
    </Container>
  );
}
