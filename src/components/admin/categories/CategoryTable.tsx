'use client';

import {
    Table,
    Flex,
    Text,
    Badge,
    IconButton,
    Card
} from '@radix-ui/themes';
import Link from 'next/link';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { CategoryTableProps } from '@/features/admin/categories/category.types';

export function CategoryTable({ categories, loading, onDelete }: CategoryTableProps) {
    return (
        <Card>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Slug</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Parent</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={5}>Loading...</Table.Cell>
                        </Table.Row>
                    ) : categories.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={5}>No categories found.</Table.Cell>
                        </Table.Row>
                    ) : (
                        categories.map((category) => (
                            <Table.Row key={category.id}>
                                <Table.Cell>
                                    <Text weight="bold">{category.name}</Text>
                                </Table.Cell>
                                <Table.Cell>{category.slug}</Table.Cell>
                                <Table.Cell>
                                    {category.parent ? (
                                        <Badge color="blue">{category.parent.name}</Badge>
                                    ) : (
                                        <Text color="gray">-</Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge color={category.isActive ? 'green' : 'gray'}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Link href={`/admin/catalog/categories/${category.id}`}>
                                            <IconButton variant="soft" color="gray">
                                                <Pencil1Icon />
                                            </IconButton>
                                        </Link>
                                        <IconButton
                                            variant="soft"
                                            color="red"
                                            onClick={() => onDelete(category.id)}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Card>
    );
}
