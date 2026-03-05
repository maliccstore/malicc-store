"use client";

import { Table, Flex, Text, Badge, IconButton, Card } from "@radix-ui/themes";
import Link from "next/link";
import { Pencil1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { CouponTableProps } from "@/features/admin/coupons/coupon.types";
import { DiscountType } from "@/features/admin/coupons/coupon.types";

export function CouponTable({ coupons, loading, onDisable }: CouponTableProps) {
  return (
    <Card>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Code</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Discount</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Usage</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Validity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6}>Loading...</Table.Cell>
            </Table.Row>
          ) : coupons.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>No coupons found.</Table.Cell>
            </Table.Row>
          ) : (
            coupons.map((coupon) => (
              <Table.Row key={coupon.id}>
                <Table.Cell>
                  <Text weight="bold">{coupon.code}</Text>
                </Table.Cell>
                <Table.Cell>
                  {coupon.discountType === DiscountType.PERCENTAGE
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </Table.Cell>
                <Table.Cell>
                  {coupon.usedCount} /{" "}
                  {coupon.usageLimit ? coupon.usageLimit : "∞"}
                </Table.Cell>
                <Table.Cell>
                  <Text size="1">
                    {new Date(coupon.validFrom).toLocaleDateString()} -{" "}
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={coupon.isActive ? "green" : "gray"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Link href={`/admin/catalog/coupons/${coupon.id}`}>
                      <IconButton variant="soft" color="gray">
                        <Pencil1Icon />
                      </IconButton>
                    </Link>
                    {coupon.isActive && (
                      <IconButton
                        variant="soft"
                        color="red"
                        onClick={() => onDisable(coupon.id)}
                        title="Disable Coupon"
                      >
                        <Cross2Icon />
                      </IconButton>
                    )}
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
