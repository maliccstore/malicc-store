"use client";

import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import StarRating from "./StarRating";
import { ProductRatingSummary } from "@/types/review";

interface RatingSummaryProps {
  summary: ProductRatingSummary;
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  summary,
  className,
}) => {
  const { averageRating = 0, totalReviews = 0 } = summary;

  return (
    <Flex direction="column" gap="1" className={className}>
      <Flex align="center" gap="2">
        <StarRating rating={averageRating} size={18} />

        <Text size="2" weight="medium">
          {averageRating.toFixed(1)} / 5
        </Text>
      </Flex>

      <Text size="2" color="gray">
        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
      </Text>
    </Flex>
  );
};

export default RatingSummary;
