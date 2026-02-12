'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchAdminUsers } from '@/store/admin/users/userThunks';
import UserTable from '@/components/admin/users/UserTable';
import { Flex, Heading } from '@radix-ui/themes';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  return (
    <Flex direction="column" gap="4" p="4">
      <Heading>Users</Heading>
      <UserTable />
    </Flex>
  );
}
