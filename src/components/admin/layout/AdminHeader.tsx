"use client";
import { Flex, Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayVisitors } from '@/services/analytics/analytics.service';
import { setLiveStats } from '@/store/admin/dashboard/dashboardSlice';
import type { RootState } from '@/store';

export default function AdminHeader() {
  const dispatch = useDispatch();
  const { todayVisitors } = useSelector((state: RootState) => state.adminDashboard.liveStats);

  useEffect(() => {
    const fetchVisitors = async () => {
      const count = await getTodayVisitors();
      // Use setLiveStats to prime the state with today's count
      dispatch(setLiveStats({
        activeSessions: 0,
        cartsActive: 0,
        checkoutActive: 0,
        todayVisitors: count
      }));
    };

    fetchVisitors();
    
    // Refresh every 5 minutes (backup)
    const interval = setInterval(fetchVisitors, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Flex
      align="center"
      justify="center"
      className="h-10 bg-gray-50 dark:bg-gray-900 border-b"
    >
      <Text size="3" className="text-gray-700 dark:text-gray-300">
        Today Visitor Count:
      </Text>
      <Text
        size="5"
        weight="bold"
        className="ml-2 text-gray-900 dark:text-white"
      >
        {todayVisitors}
      </Text>
    </Flex>
  );
}
