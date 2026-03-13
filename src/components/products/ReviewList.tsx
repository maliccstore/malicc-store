"use client";

import React from "react";
import { Flex, Text, Heading, Box } from "@radix-ui/themes";
import ReviewItem from "./ReviewItem";
import { Review } from "@/types/review";
import { MessageSquareOff } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onRefresh,
  loading = false,
}) => {
  if (loading) {
    return (
      <Flex direction="column" gap="4" py="8" align="center">
        <Text color="gray">Loading reviews...</Text>
      </Flex>
    );
  }

  if (reviews.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="3"
        py="8"
        className="bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
      >
        <MessageSquareOff size={32} className="text-gray-300" />
        <Flex direction="column" align="center" gap="1">
          <Text size="3" weight="bold" color="gray">
            No reviews yet
          </Text>
          <Text size="2" color="gray">
            Be the first to share your thoughts about this product.
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex align="center" gap="2">
          <Heading size="4">Customer Reviews</Heading>
          <Text
            size="2"
            color="gray"
            weight="medium"
            className="px-2 py-0.5 rounded-full"
          >
            {reviews.length}
          </Text>
        </Flex>
        <Flex direction="column">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onUpdate={onRefresh}
              onDelete={onRefresh}
            />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ReviewList;
