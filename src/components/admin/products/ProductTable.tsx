'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ProductRowActions from './ProductRowActions';
import { Badge, Table, Text, Avatar, Flex } from '@radix-ui/themes';

export default function ProductTable() {
  const { list, loading } = useSelector(
    (state: RootState) => state.adminProducts
  );

  // loading state
  if (loading) return <Text size="2" color="gray">Loading products...</Text>;
  if (!list.length) return <Text size="2" color="gray">No products found. Start by adding one!</Text>;

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {list.map((p) => (
          <Table.Row key={p.id} align="center">
            <Table.Cell>
              <Flex gap="3" align="center">
                <Avatar
                  fallback={p.name.substring(0, 2).toUpperCase()}
                  src={p.images?.[0]}
                  size="1"
                  radius="medium"
                />
                <Flex direction="column">
                  <Text weight="bold" size="2">{p.name}</Text>
                  <Text size="1" color="gray" className="truncate max-w-[200px]">{p.description}</Text>
                </Flex>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Text size="2">₹{p.price.toFixed(2)}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="2" color={(p.inventory?.quantity || 0) < 10 ? 'red' : undefined}>{p.inventory?.quantity || 0}</Text>
            </Table.Cell>
            <Table.Cell>
              <Badge color={p.status === 'ACTIVE' ? 'green' : 'gray'}>
                {p.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <ProductRowActions productId={p.id} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
