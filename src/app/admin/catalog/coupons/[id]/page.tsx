"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Heading, Flex, Button, Text } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import CouponForm from "@/components/admin/coupons/CouponForm";
import { adminCouponAPI } from "@/services/admin/coupon.admin";
import {
  CouponFormValues,
  UpdateCouponInput,
  DiscountType,
} from "@/features/admin/coupons/coupon.types";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialValues, setInitialValues] = useState<CouponFormValues | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data } = await adminCouponAPI.getById(id);
        // Convert dates back to local datetime string format for the input field
        const vFrom = new Date(data.validFrom);
        const vFromStr = new Date(
          vFrom.getTime() - vFrom.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16);

        const vUntil = new Date(data.validUntil);
        const vUntilStr = new Date(
          vUntil.getTime() - vUntil.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16);

        setInitialValues({
          code: data.code,
          discountType: data.discountType as DiscountType,
          discountValue: data.discountValue,
          maxDiscount: data.maxDiscount || null,
          minOrderValue: data.minOrderValue || null,
          usageLimit: data.usageLimit || null,
          perUserLimit: data.perUserLimit || null,
          validFrom: vFromStr,
          validUntil: vUntilStr,
          isActive: data.isActive,
        });
      } catch (err: unknown) {
        console.error("Failed to fetch coupon:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch coupon");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoupon();
    }
  }, [id]);

  const handleSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      const input: UpdateCouponInput = {
        discountValue: data.discountValue,
        maxDiscount: data.maxDiscount || undefined,
        minOrderValue: data.minOrderValue || undefined,
        usageLimit: data.usageLimit || undefined,
        perUserLimit: data.perUserLimit || undefined,
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString(),
        isActive: data.isActive,
      };

      await adminCouponAPI.update(id, input);
      router.push("/admin/catalog/coupons");
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to update coupon:", err);
      alert((err as Error).message || "Failed to update coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error || !initialValues) {
    return <Text color="red">Error: {error || "Coupon not found"}</Text>;
  }

  return (
    <Flex direction="column" gap="4">
      <Flex align="center" gap="4">
        <Link href="/admin/catalog/coupons">
          <Button variant="soft" color="gray">
            <ArrowLeftIcon /> Back
          </Button>
        </Link>
        <Heading size="6">Edit Coupon</Heading>
      </Flex>

      <Flex direction="column" style={{ maxWidth: 800 }}>
        <CouponForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
      </Flex>
    </Flex>
  );
}
