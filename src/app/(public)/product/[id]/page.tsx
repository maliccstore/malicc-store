"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { Product } from "@/types/product";

import { Box, Container, Heading, Text } from "@radix-ui/themes";
import ProductDetailsSkeleton from "@/components/products/ProductDetailsSkeleton";
import RatingSummary from "@/components/products/RatingSummary";
import ReviewList from "@/components/products/ReviewList";
import ReviewForm from "@/components/products/ReviewForm";
import ProductGallery from "@/components/products/ProductGallery";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";

import { productService } from "@/services/product.service";
import { orderAPI } from "@/services/orderAPI";

import { Review, ProductRatingSummary } from "@/types/review";
import { useAuth } from "@/features/auth/hooks/useAuthActions";

import { Button } from "@/components/ui/Button";

type OrderItem = {
  productId: string;
};

type Order = {
  id: string;
  items?: OrderItem[];
};

const ProductPage = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const id = params.id;
  const productId = Array.isArray(id) ? id[0] : id;

  const { products, loading } = useSelector(
    (state: RootState) => state.products,
  );

  const { isAuthenticated, user } = useAuth();

  const product = useMemo(
    () => products.find((p: Product) => String(p.id) === String(productId)),
    [products, productId],
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] =
    useState<ProductRatingSummary | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [purchasedOrderId, setPurchasedOrderId] = useState<string | null>(null);

  const fetchReviewData = useCallback(async () => {
    if (!productId) return;

    try {
      const [reviewsData, ratingData] = await Promise.all([
        productService.getProductReviews(productId),
        productService.getProductRatingSummary(productId),
      ]);

      setReviews(reviewsData);
      setRatingSummary(ratingData);
    } catch (error) {
      console.error("Failed to fetch review data", error);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setLoadingReviews(true);
      await fetchReviewData();
      setLoadingReviews(false);
    };

    load();
  }, [fetchReviewData, productId]);

  useEffect(() => {
    if (!isAuthenticated || !product) return;

    const checkPurchase = async () => {
      try {
        const response = await orderAPI.myOrders();
        const orders: Order[] = response?.orders ?? [];

        const matchedOrder = orders.find((order: Order) =>
          order.items?.some((item: OrderItem) => item.productId === product.id),
        );

        if (matchedOrder) {
          setPurchasedOrderId(matchedOrder.id);
        }
      } catch (error) {
        console.error("Failed to check purchase history", error);
      }
    };

    checkPurchase();
  }, [isAuthenticated, product]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart(product));
  };

  const handleReviewCreated = async () => {
    await fetchReviewData();
  };

  const handleReviewDeleted = async () => {
    await fetchReviewData();
  };

  const hasReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some((r) => String(r.userId) === String(user.id));
  }, [reviews, user]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <Container className="p-4 text-center">
        <Heading size="4">Product not found</Heading>
        <Text color="gray">
          The product you are looking for does not exist.
        </Text>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      {/* Product Image */}

      <ProductGallery 
        images={product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])} 
        productName={product.name} 
      />

      {/* Product Info */}

      <div className="mb-6">
        <div className="flex justify-between items-start">
          <Heading size="4">{product.name}</Heading>

          {ratingSummary && <RatingSummary summary={ratingSummary} />}
        </div>

        <Text size="2" color="gray">
          {product.description}
        </Text>
      </div>

      {/* Review Form */}

      {purchasedOrderId && !hasReviewed && (
        <Box className="mb-8">
          <ReviewForm
            productId={product.id}
            orderId={purchasedOrderId}
            onComplete={handleReviewCreated}
          />
        </Box>
      )}

      {/* Review List */}

      <ReviewList
        reviews={reviews}
        loading={loadingReviews}
        onRefresh={handleReviewDeleted}
      />

      {/* Add to Cart */}

      <div className="sticky bottom-12 flex justify-center mt-8">
        <Button
          onClick={handleAddToCart}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition max-w-md w-full"
        >
          Add to Cart
        </Button>
      </div>
    </Container>
  );
};

export default ProductPage;
