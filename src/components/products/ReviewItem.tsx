"use client";

import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  AlertDialog,
  Button,
} from "@radix-ui/themes";
import StarRating from "./StarRating";
import { Review } from "@/types/review";
import { formatDate } from "@/utils/format";
import { useAuth } from "@/features/auth/hooks/useAuthActions";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { productService } from "@/services/product.service";
import ReviewForm from "./ReviewForm";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAdminUsers } from "@/store/admin/users/userThunks";

interface ReviewItemProps {
  review: Review;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onUpdate,
  onDelete,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const users = useSelector((state: RootState) => state.adminUsers.list);

  const isOwner = user?.id === review.userId;
  const username =
    users.find((u) => String(u.id) === String(review.userId))?.username ??
    "customer";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.deleteReview(review.id);
      toast.success("Review deleted successfully");
      setDialogOpen(false);
      if (onDelete) onDelete();
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string }).message || "Failed to delete review",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Box py="4" className="border-b border-gray-100 last:border-none">
        <ReviewForm
          productId={review.productId}
          initialData={review}
          onComplete={() => {
            setIsEditing(false);
            if (onUpdate) onUpdate();
          }}
          className="shadow-none border-none bg-transparent p-0"
        />
        <Button
          variant="soft"
          color="gray"
          mt="2"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </Box>
    );
  }

  return (
    <Box py="4" className="border-b border-gray-100 last:border-none group">
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Avatar
              size="2"
              fallback={username.charAt(0).toUpperCase()}
              radius="full"
              color={isOwner ? "blue" : "gray"}
              variant="soft"
            />
            <Flex direction="column">
              <Text size="2" weight="bold">
                {username}
              </Text>
              <Text size="1" color="gray">
                {formatDate(review.createdAt)}
              </Text>
            </Flex>
          </Flex>

          <Flex align="center" gap="3">
            <StarRating rating={review.rating} size={16} />

            {isOwner && (
              <Flex gap="1">
                <Tooltip content="Edit Review">
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil1Icon />
                  </IconButton>
                </Tooltip>

                <AlertDialog.Root
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                >
                  <Tooltip content="Delete Review">
                    <AlertDialog.Trigger>
                      <IconButton size="1" variant="ghost" color="red">
                        <TrashIcon />
                      </IconButton>
                    </AlertDialog.Trigger>
                  </Tooltip>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete Review</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure you want to delete this review? This action
                      cannot be undone.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button
                          variant="soft"
                          color="gray"
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <Button
                        variant="solid"
                        color="red"
                        onClick={handleDelete}
                        loading={isDeleting}
                      >
                        Delete Review
                      </Button>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </Flex>
            )}
          </Flex>
        </Flex>

        {review.reviewText && (
          <Text size="2" color="gray" className="leading-relaxed">
            {review.reviewText}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default ReviewItem;
