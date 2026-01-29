'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Product } from '@/types/product';
import { Heading, Text, Card } from '@radix-ui/themes';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToCart as addToCartAction } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { useAuth } from '@/features/auth/hooks/useAuthActions';
import { MouseEvent } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Product removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Product added to wishlist');
    }
  };
  return (
    <Card
      onClick={handleClick}
      className="m-2 w-full max-w-xs overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Wishlist Button */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
        <button
          className="absolute top-2 right-2 z-20 p-2 bg-white/90 hover:bg-white transition-colors rounded-full shadow-md"
          onClick={handleWishlistClick}
          type="button"
        >
          <Heart
            size={20}
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <ImageIcon className="text-gray-400" size={48} />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <Heading as="h3" size="4" className="font-bold line-clamp-1">
            {product.name}
          </Heading>
          <Text as="p" size="2" className="text-gray-600 line-clamp-2">
            {product.description}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text as="span" size="4" className="font-bold text-gray-900">
            ${product.price}
          </Text>
          <Button
            onClick={async (e) => {
              e.stopPropagation();
              // Optimistic update (or keeping existing behavior)
              dispatch(addToCartAction(product));

              if (isAuthenticated) {
                try {
                  const { cartAPI } = await import('@/services/cart.service');
                  await cartAPI.addToCart(String(product.id), 1);
                  toast.success("Added to cart");
                } catch (err) {
                  console.error("Failed to sync cart", err);
                  // toast.error("Failed to save to account"); // Optional
                }
              } else {
                toast.success("Added to cart");
              }
            }}
            className="hover:bg-gray-900 hover:text-white transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
