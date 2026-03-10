"use client";

import { useEffect, useState } from "react";
import { Flex, Text, Card } from "@radix-ui/themes";
import {
  getDashboardStats,
  DashboardStats,
} from "@/services/admin/dashboard.admin";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (loading) {
    return (
      <Flex direction="column" gap="4" p="4">
        <Text size="5" weight="bold">
          Admin Dashboard
        </Text>

        <Flex direction="column" gap="3">
          <Card>
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Total Revenue
              </Text>
              <Text size="6" weight="bold">
                Loading...
              </Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Total Orders
              </Text>
              <Text size="6" weight="bold">
                Loading...
              </Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Total Customers
              </Text>
              <Text size="6" weight="bold">
                Loading...
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" p="4">
      <Text size="5" weight="bold">
        Admin Dashboard
      </Text>

      <Flex direction="column" gap="3">
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">
              Total Revenue
            </Text>
            <Text size="6" weight="bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">
              Total Orders
            </Text>
            <Text size="6" weight="bold">
              {stats?.totalOrders || 0}
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">
              Total Customers
            </Text>
            <Text size="6" weight="bold">
              {stats?.totalCustomers || 0}
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}