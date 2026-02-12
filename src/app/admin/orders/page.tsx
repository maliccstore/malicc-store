'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders } from '@/store/admin/order/orderThunks';
import { AppDispatch, RootState } from '@/store';
import OrderTable from '@/components/admin/orders/OrderTable';
import { Flex, Heading, Text } from '@radix-ui/themes';

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.adminOrders);

  // fetch orders on mount
  useEffect(() => {
    dispatch(fetchAdminOrders(undefined));
  }, [dispatch]);

  // loading states
  if (loading && list.length === 0) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Flex direction="column" gap="4">
      <Heading>Orders</Heading>
      {list.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        // order table component
        <OrderTable orders={list} />
      )}
    </Flex>
  );
}
