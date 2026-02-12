'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Badge, Table, Text, Avatar, Flex } from '@radix-ui/themes';
import { UserRole } from '@/features/admin/users/users.types';

// Props interface for UserTable component
interface UserTableProps {
    roleFilter?: UserRole;
}

export default function UserTable({ roleFilter }: UserTableProps) {
    const { list: allUsers, loading } = useSelector(
        (state: RootState) => state.adminUsers
    );

    // Filter users based on role if roleFilter is provided
    const list = roleFilter
        ? allUsers.filter(user => user.role === roleFilter)
        : allUsers;

    if (!list.length && !loading) return <Text size="2" color="gray">No users found.</Text>;
    if (loading && !list.length) return <Text size="2" color="gray">Loading users...</Text>;

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                    {/* <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell> */}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {list.map((user) => (
                    <Table.Row key={user.id} align="center">
                        <Table.Cell>
                            <Flex gap="3" align="center">
                                <Avatar
                                    fallback={user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                                    size="1"
                                    radius="medium"
                                />
                                <Flex direction="column">
                                    <Text weight="bold" size="2">{user.username || 'N/A'}</Text>
                                    <Text size="1" color="gray">{user.email || 'No Email'}</Text>
                                </Flex>
                            </Flex>
                        </Table.Cell>
                        <Table.Cell>
                            <Flex direction="column">
                                <Text size="2">{user.phoneNumber}</Text>
                                <Text size="1" color={user.isPhoneVerified ? 'green' : 'red'}>
                                    {user.isPhoneVerified ? 'Verified' : 'Unverified'}
                                </Text>
                            </Flex>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge color={user.role === 'ADMIN' ? 'ruby' : user.role === 'SUPERADMIN' ? 'gold' : 'blue'}>
                                {user.role}
                            </Badge>
                        </Table.Cell>
                        {/* <Table.Cell>
                            <Text size="2">
                                {new Date(Number(user.createdAt)).toLocaleDateString()}
                            </Text>
                        </Table.Cell> */}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
