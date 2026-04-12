"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Product } from "@/types/product";
import { ProductRatingSummary } from "@/types/review";
import { Heading, Text, Card } from "@radix-ui/themes";
import { Heart, Image as ImageIcon, Minus, Plus } from "lucide-react";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCartItemThunk } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { useAuth } from "@/features/auth/hooks/useAuthActions";
import { MouseEvent } from "react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/format";
import StarRating from "./StarRating";
import { productService } from "@/services/product.service";
import { trackEvent } from "@/services/analytics/analytics.service";
import { getSessionId } from "@/services/analytics/session";
import { ANALYTICS_EVENTS } from "@/constants";


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const cartItem = cartItems.find(
    (item) => String(item.id) === String(product.id),
  );

  const user = useAppSelector((state) => state.auth.user);

  const handleUpdateQuantity = async (newQuantity: number) => {
    const prevQuantity = cartItem?.quantity || 0;

    dispatch(
      updateCartItemThunk({
        productId: String(product.id),
        newQuantity,
        product,
      }),
    );

    // 🔥 Track only when item is added first time
    if (prevQuantity === 0 && newQuantity > 0) {
      trackEvent({
        event: ANALYTICS_EVENTS.ADD_TO_CART,
        sessionId: getSessionId(),
        userId: user?.id,
        metadata: {
          productId: product.id,
          quantity: newQuantity,
        },
      });
    }
  };

  // Derived availability flags
  const isUnavailable = product.isActive === false;

  // Rating summary fetched from API
  const [ratingSummary, setRatingSummary] =
    useState<ProductRatingSummary | null>(null);

  useEffect(() => {
    productService
      .getProductRatingSummary(String(product.id))
      .then(setRatingSummary)
      .catch(() => {
        // silently ignore — card still renders without rating
      });
  }, [product.id]);

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Product removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Product added to wishlist");
    }
  };
  return (
    <Card
      onClick={handleClick}
      className="m-2 w-full max-w-xs overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Wishlist Button */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
        <Button
          className="absolute top-2 right-2 z-20 p-2 bg-white/90 hover:bg-white transition-colors rounded-full shadow-md"
          onClick={handleWishlistClick}
          type="button"
        >
          <Heart
            size={20}
            className={
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }
          />
        </Button>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 hover:scale-105 ${isUnavailable || !product.inStock ? "opacity-50 grayscale" : ""
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <ImageIcon className="text-gray-400" size={48} />
        )}
        {isUnavailable && (
          <div className="absolute inset-0 z-10 flex items-end justify-start p-2 pointer-events-none">
            <span className="text-xs font-semibold tracking-wide uppercase bg-gray-600 text-white px-2 py-0.5 rounded-sm shadow">
              Unavailable
            </span>
          </div>
        )}
        {!isUnavailable && !product.inStock && (
          <div className="absolute inset-0 z-10 flex items-end justify-start p-2 pointer-events-none">
            <span className="text-xs font-semibold tracking-wide uppercase bg-red-600 text-white px-2 py-0.5 rounded-sm shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex justify-between">
            <Heading as="h3" size="4" className="font-bold line-clamp-1">
              {product.name}
            </Heading>
            {/* rating */}
            {ratingSummary && (
              <div className="flex items-center gap-1.5">
                <StarRating
                  rating={ratingSummary.averageRating ?? 0}
                  size={10}
                />
                <Text size="1" color="gray">
                  {ratingSummary.totalReviews}
                </Text>
              </div>
            )}
          </div>

          <Text as="p" size="2" color="gray">
            {product.description}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text as="span" size="4">
            {formatCurrency(product.price)}
          </Text>
          <div onClick={(e) => e.stopPropagation()}>
            {/* Check if product is in cart */}
            {cartItem ? (
              <div className="flex items-center justify-between w-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(cartItem.quantity - 1);
                  }}
                  className="h-8 w-10 !p-0 !bg-transparent !text-gray-600 hover:!bg-gray-50 flex items-center justify-center rounded-none border-r border-gray-100"
                >
                  <Minus size={20} />
                </Button>
                <span className="text-sm font-semibold w-8 text-center text-gray-900">
                  {cartItem.quantity}
                </span>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(cartItem.quantity + 1);
                  }}
                  disabled={
                    product.availableQuantity !== undefined &&
                    product.availableQuantity !== null &&
                    cartItem.quantity >= product.availableQuantity
                  }
                  className="h-8 w-10 !p-0 !bg-transparent !text-gray-600 hover:!bg-gray-50 flex items-center justify-center rounded-none border-l border-gray-100 disabled:opacity-50"
                >
                  <Plus size={20} />
                </Button>
              </div>
            ) : isUnavailable ? (
              <Button
                disabled
                className="opacity-50 cursor-not-allowed"
                aria-disabled="true"
              >
                Unavailable
              </Button>
            ) : product.inStock === false ? (
              <Button
                disabled
                className="opacity-50 cursor-not-allowed"
                aria-disabled="true"
              >
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  handleUpdateQuantity(1);
                }}
                className="hover:bg-gray-900 hover:text-white transition-colors"
                disabled={
                  product.availableQuantity !== undefined &&
                  product.availableQuantity !== null &&
                  product.availableQuantity <= 0
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
