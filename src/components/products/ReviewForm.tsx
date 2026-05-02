"use client";

import React, { useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  TextArea,
  Card,
  Callout,
} from "@radix-ui/themes";
import StarRating from "./StarRating";
import { productService } from "@/services/product.service";
import { Review, CreateReviewInput, UpdateReviewInput } from "@/types/review";
import { InfoCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  orderId?: string; // Optional for edit mode
  initialData?: Review; // Provided for edit mode
  onComplete?: () => void;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  orderId,
  initialData,
  onComplete,
  className,
}) => {
  const isEditMode = !!initialData;
  const [rating, setRating] = useState<number>(initialData?.rating || 5);
  const [reviewText, setReviewText] = useState<string>(
    initialData?.reviewText || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        const input: UpdateReviewInput = {
          rating,
          reviewText: reviewText.trim() || undefined,
        };
        await productService.updateReview(initialData.id, input);
        toast.success("Review updated successfully!");
      } else {
        if (!orderId)
          throw new Error("Order ID is required to create a review");
        const input: CreateReviewInput = {
          productId,
          orderId,
          rating,
          reviewText: reviewText.trim() || undefined,
        };
        await productService.createReview(input);
        toast.success("Review submitted successfully!");
      }

      setIsSubmitted(true);
      if (onComplete) onComplete();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to process review. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card
        size="3"
        className={className}
        style={{ color: "green", backgroundColor: "var(--green-2)" }}
      >
        <Flex direction="column" align="center" gap="3" py="4">
          <CheckCircledIcon width="32" height="32" />
          <Heading size="4">
            {isEditMode ? "Review updated!" : "Thank you for your review!"}
          </Heading>
          <Text size="2">
            {isEditMode
              ? "Your changes have been saved."
              : "Your feedback helps other shoppers make better choices."}
          </Text>
          <Text size="1" color="yellow" className="text-yellow-800">
            {!isEditMode &&
              "Note: Your review may be subject to approval and might not appear immediately."}
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3" className={className}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Heading size="4">
            {isEditMode ? "Edit Review" : "Write a Review"}
          </Heading>

          <Flex direction="column" gap="2">
            <Text size="2" weight="bold" color="gray">
              Overall Rating
            </Text>
            <StarRating
              rating={rating}
              interactive
              onRatingChange={setRating}
              size={28}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="2" weight="bold" color="gray">
              Review Details
            </Text>
            <TextArea
              placeholder="What did you like or dislike? How was the quality?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ maxHeight: "120px" }}
              size="3"
            />
          </Flex>

          {error && (
            <Callout.Root color="red" size="1">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <Button
            type="submit"
            size="3"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="cursor-pointer"
          >
            {isEditMode ? "Update Review" : "Submit Review"}
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default ReviewForm;
