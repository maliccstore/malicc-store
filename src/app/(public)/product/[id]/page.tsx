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
import { formatCurrency } from "@/utils/format";


import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart, removeFromCart } from "@/store/slices/cartSlice";
import { Minus, Plus } from "lucide-react";

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

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = useMemo(() => cartItems.find(item => String(item.id) === String(productId)), [cartItems, productId]);

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
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (!product?.category) return;

    const fetchCategory = async () => {
      try {
        const { categoryService } = await import("@/services/category.service");
        const categories = await categoryService.getAll();
        const matchedCategory = categories.find((c) => String(c.id) === String(product.category));
        if (matchedCategory) {
          setCategoryName(matchedCategory.name);
        }
      } catch (error) {
        console.error("Failed to fetch category names", error);
      }
    };

    fetchCategory();
  }, [product?.category]);

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

  const handleAddToCart = async () => {
    if (!product) return;

    // Optimistic Redux update
    dispatch(addToCart(product));

    if (isAuthenticated) {
      try {
        const { cartAPI } = await import("@/services/cart.service");
        await cartAPI.addToCart(String(product.id), 1);
        // toast.success("Synced with your account");
      } catch (error) {
        console.error("Failed to sync cart with backend", error);
      }
    }
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
        isUnavailable={product.isActive === false}
      />

      {/* Unavailable notice banner */}
      {product.isActive === false && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-700">
          <span className="text-sm font-medium">
            ⚠️ This product is currently unavailable and cannot be purchased.
          </span>
        </div>
      )}

      {/* Product Info */}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-2">
          {categoryName && (
            <div>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 rounded-full">
                {categoryName}
              </span>
            </div>
          )}

          <div className="flex justify-between items-start">
            <Heading size="6">{product.name}</Heading>

            {ratingSummary && <RatingSummary summary={ratingSummary} />}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Text size="6" weight="bold">
            {formatCurrency(product.price)}
          </Text>
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              product.isActive === false
                ? "bg-gray-200 text-gray-600"
                : product.inStock !== false
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive === false
              ? "Unavailable"
              : product.inStock !== false
              ? "In Stock"
              : "Out of Stock"}
          </span>
        </div>

        <Text size="3" color="gray" className="block mt-4">
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
      <div className="sticky bottom-12 flex justify-center">
        {product.isActive === false ? (
          <Button
            disabled
            aria-disabled="true"
            className="px-6 py-2 opacity-50 cursor-not-allowed max-w-md w-full"
          >
            Unavailable
          </Button>
        ) : cartItem ? (
          <div className="flex items-center justify-between max-w-[200px] w-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <Button
              onClick={() => dispatch(removeFromCart(String(product.id)))}
              className="h-12 w-14 !p-0 !bg-transparent !text-gray-600 hover:!bg-gray-50 flex items-center justify-center rounded-none border-r border-gray-100 transition-colors"
            >
              <Minus size={20} />
            </Button>
            <span className="text-lg font-semibold w-12 text-center text-gray-900">
              {cartItem.quantity}
            </span>
            <Button
              onClick={() => dispatch(addToCart(product))}
              className="h-12 w-14 !p-0 !bg-transparent !text-gray-600 hover:!bg-gray-50 flex items-center justify-center rounded-none border-l border-gray-100 transition-colors"
            >
              <Plus size={20} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors max-w-md w-full"
          >
            {product.inStock === false ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default ProductPage;
