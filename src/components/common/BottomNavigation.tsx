import { Flex, IconButton, Text } from '@radix-ui/themes';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

export default function BottomNavigation() {
  return (
    <Flex
      position="sticky"
      bottom="0"
      left="0"
      right="0"
      width="100%"
      style={{
        backgroundColor: 'var(--color-panel)',
        borderTop: '1px solid var(--gray-a6)',
        padding: '0.5rem 0',
        zIndex: 50, // Ensure it stays above other content
      }}
    >
      <Flex justify="between" align="center" px="4" width="100%">
        <Link href="/" passHref>
          <IconButton size="3" variant="ghost" color="gray" highContrast>
            <Home size={20} />
          </IconButton>
        </Link>

        <Link href="/search" passHref>
          <IconButton size="3" variant="ghost" color="gray" highContrast>
            <Search size={20} />
          </IconButton>
        </Link>

        <Link href="/new" passHref>
          <Text>New</Text>
        </Link>

        <Link href="/cart" passHref>
          <IconButton size="3" variant="ghost" color="gray" highContrast>
            <ShoppingCart size={20} />
          </IconButton>
        </Link>

        <Link href="/profile" passHref>
          <IconButton size="3" variant="ghost" color="gray" highContrast>
            <User size={20} />
          </IconButton>
        </Link>
      </Flex>
    </Flex>
  );
}
