'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getOrderDetails, updateOrderStatus, ORDER_STATUS, OrderStatus } from '@/services/admin/order.admin';
import { Box, Card, Flex, Grid, Heading, Table, Text, Select } from '@radix-ui/themes';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { Order } from '@/features/admin/orders/order.types';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch order details
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrderDetails(id);
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error(data.message || 'Failed to load order');
      }
    } catch {
      toast.error('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  // update order status
  const handleStatusUpdate = async (status: string) => {
    try {
      const data = await updateOrderStatus(id, status as OrderStatus);
      if (data.success) {
        toast.success('Order status updated');
        setOrder(prev => prev ? ({ ...prev, status }) : null);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  // loading states
  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <Box height="100%" width="100%" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
      <Flex direction="column" gap="4" maxWidth="800px" mx="auto" p="4">
        <Card size="3">
          <Flex justify="between" align="center" mb="4">
            <Heading size="4">Order Items</Heading>
            <Text color="gray" size="2">
              {order.items.length} items
            </Text>
          </Flex>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {order.items.map((item: { id: string; productName: string; unitPrice: number; quantity: number; totalPrice: number }) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.unitPrice)}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.totalPrice)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
        {/* Payment & Shipping */}
        <Card size="3">
          <Heading size="4" mb="4">Payment & Shipping</Heading>
          <Grid columns="2" gap="4">
            <Box>
              <Text weight="bold" as="div">Payment Method</Text>
              <Text>{order.paymentMethod || 'N/A'}</Text>
            </Box>
            <Box>
              <Text weight="bold" as="div">Shipping Method</Text>
              <Text>{order.shippingMethod || 'Standard'}</Text>
            </Box>
          </Grid>
        </Card>
        {/* Order Summary */}
        <Card size="3">
          <Heading size="4" mb="4">Order Summary</Heading>
          <Flex direction="column" gap="3">
            <Flex justify="between">
              <Text color="gray">Subtotal</Text>
              <Text>{formatCurrency(order.subtotal)}</Text>
            </Flex>
            <Flex justify="between">
              <Text color="gray">Tax</Text>
              <Text>{formatCurrency(order.tax)}</Text>
            </Flex>
            <Flex justify="between">
              <Text color="gray">Shipping</Text>
              <Text>{formatCurrency(order.shippingFee)}</Text>
            </Flex>
            <Box height="1px" style={{ backgroundColor: 'var(--gray-5)' }} />
            <Flex justify="between">
              <Text weight="bold">Total</Text>
              <Text weight="bold" size="5">{formatCurrency(order.totalAmount)}</Text>
            </Flex>
          </Flex>
        </Card>
        {/* Customer */}
        <Card size="3">
          <Heading size="4" mb="4">Customer</Heading>
          <Flex direction="column" gap="2">
            <Text weight="bold">{order.shippingAddress?.fullName}</Text>
            <Text>{order.shippingAddress?.phoneNumber}</Text>
            <Text>
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && <><br />{order.shippingAddress?.addressLine2}</>}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              <br />
              {order.shippingAddress?.country}
            </Text>
          </Flex>
        </Card>
        {/* Status */}
        <Card size="3">
          <Heading size="4" mb="4">Status</Heading>
          <Flex direction="column" gap="4">
            <Select.Root value={order.status} onValueChange={handleStatusUpdate}>
              <Select.Trigger />
              <Select.Content>
                {Object.values(ORDER_STATUS).map((status) => (
                  <Select.Item key={status} value={status}>
                    {status}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Text size="1" color="gray">
              Last updated: {new Date(order.updatedAt).toLocaleString()}
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
