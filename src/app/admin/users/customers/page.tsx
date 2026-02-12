'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchAdminUsers } from '@/store/admin/users/userThunks';
import UserTable from '@/components/admin/users/UserTable';
import { Flex, Heading } from '@radix-ui/themes';
import { UserRole } from '@/features/admin/users/users.types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.adminUsers);

  // fetch users on mount
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // loading states
  if (loading && list.length === 0) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Flex direction="column" gap="4" p="4">
      <Heading>Customers</Heading>
      {/* user table component */}
      <UserTable roleFilter={UserRole.CUSTOMER} />
    </Flex>
  );
}
