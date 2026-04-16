"use client";

import { useEffect, useState } from "react";
import { Flex, Text, Card } from "@radix-ui/themes";
import {
  getDashboardStats,
  DashboardStats,
} from "@/services/admin/dashboard.admin";
import { subscribeToLiveAnalytics } from "@/services/analytics/analytics.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLiveStats } from "@/store/admin/dashboard/dashboardSlice";

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

  const dispatch = useDispatch();
  const liveStats = useSelector(
    (state: RootState) => state.adminDashboard.liveStats,
  );

  useEffect(() => {
    const unsubscribe = subscribeToLiveAnalytics(
      (data) => {
        if (data?.liveAnalytics) {
          dispatch(setLiveStats(data.liveAnalytics));
        }
      },
      (error) => {
        console.error("Live analytics error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

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

      {/* Live Analytics Section */}
      <Text size="4" weight="bold" mt="4">
        Live Analytics
      </Text>
      <Flex gap="3" direction={{ initial: "column", sm: "row" }} wrap="wrap">
        <Card style={{ flex: 1, backgroundColor: "#e0f7fa" }}>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray" weight="bold">
              Active Users
            </Text>
            <Text size="6" weight="bold">
              {liveStats.activeSessions}
            </Text>
          </Flex>
        </Card>

        <Card style={{ flex: 1, backgroundColor: "#fff3e0" }}>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray" weight="bold">
              Live Carts
            </Text>
            <Text size="6" weight="bold">
              {liveStats.cartsActive}
            </Text>
          </Flex>
        </Card>

        <Card style={{ flex: 1, backgroundColor: "#e8f5e9" }}>
          <Flex direction="column" gap="2">
            <Text size="2" color="gray" weight="bold">
              Live Orders
            </Text>
            <Text size="6" weight="bold">
              {liveStats.checkoutActive}
            </Text>
          </Flex>
        </Card>
      </Flex>

      <Text size="4" weight="bold" mt="4">
        General Stats
      </Text>
      <Flex gap="3" direction="column">
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
