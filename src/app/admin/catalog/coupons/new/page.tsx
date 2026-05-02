"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, Flex, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import CouponForm from "@/components/admin/coupons/CouponForm";
import { adminCouponAPI } from "@/services/admin/coupon.admin";
import {
  CouponFormValues,
  CreateCouponInput,
} from "@/features/admin/coupons/coupon.types";

export default function NewCouponPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert strings to ISO formatted strings for the API
      const input: CreateCouponInput = {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscount: data.maxDiscount || undefined,
        minOrderValue: data.minOrderValue || undefined,
        usageLimit: data.usageLimit || undefined,
        perUserLimit: data.perUserLimit || undefined,
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString(),
      };

      await adminCouponAPI.create(input);
      router.push("/admin/catalog/coupons");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to create coupon:", error.message);
      } else {
        console.error("Failed to create coupon:", error);
      }
      console.error("Failed to create coupon:", error);
      alert("Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Flex align="center" gap="4">
        <Link href="/admin/catalog/coupons">
          <Button variant="soft" color="gray">
            <ArrowLeftIcon /> Back
          </Button>
        </Link>
        <Heading size="6">Create New Coupon</Heading>
      </Flex>

      <Flex direction="column" style={{ maxWidth: 800 }}>
        <CouponForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditMode={false}
        />
      </Flex>
    </Flex>
  );
}
