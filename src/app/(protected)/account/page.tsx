"use client";
import React from "react";
import { RootState } from "@/store";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Container, Flex, Heading, Text, Separator } from "@radix-ui/themes";

export default function AccountPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Menu Items List
  const menuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Orders", href: "/orders" },
    { label: "Address", href: "/address" },
    { label: "Wish-list", href: "/wishlist" },
    { label: "Settings", href: "/settings" },
    { label: "Help", href: "/help" },
  ];

  return (
    <Container size="2">
      <Flex direction="column" gap="5" py="6">
        <Heading size="6" weight="light" >
          Welcome, {user?.username || "User"}
        </Heading>
        {/* Menu Items */}
        <Flex direction="column" gap="0">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Flex
                  justify="between"
                  align="center"
                  py="3"
                  px="2"
                  className={`
                    hover:bg-[var(--gray-a2)] transition-colors cursor-pointer rounded-md`}
                >
                  <Text size="3" weight="light">
                    {item.label}
                  </Text>
                  <ChevronRight size={18} className="text-[var(--gray-8)]" />
                </Flex>
              </Link>
              {index < menuItems.length - 1 && <Separator size="4" />}
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
}
