'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Product } from '@/types/product';
import { Heading, Text, Card } from '@radix-ui/themes';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToCart as addToCartAction, removeFromCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { Minus, Plus } from 'lucide-react';
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
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const cartItem = cartItems.find(item => String(item.id) === String(product.id));
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
        <Button
          className="absolute top-2 right-2 z-20 p-2 bg-white/90 hover:bg-white transition-colors rounded-full shadow-md"
          onClick={handleWishlistClick}
          type="button"
        >
          <Heart
            size={20}
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </Button>
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
          <Text as="p" size="2" color="gray">
            {product.description}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text as="span" size="4" >
            ${product.price}
          </Text>
          <div onClick={(e) => e.stopPropagation()}>
            {/* Check if product is in cart */}
            {cartItem ? (
              <div className="flex items-center justify-between w-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart(String(product.id)));
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
                    dispatch(addToCartAction(product));
                  }}
                  className="h-8 w-10 !p-0 !bg-transparent !text-gray-600 hover:!bg-gray-50 flex items-center justify-center rounded-none border-l border-gray-100"
                >
                  <Plus size={20} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  dispatch(addToCartAction(product));

                  if (isAuthenticated) {
                    try {
                      const { cartAPI } = await import('@/services/cart.service');
                      await cartAPI.addToCart(String(product.id), 1);
                      toast.success("Added to cart");
                    } catch (err) {
                      console.error("Failed to sync cart", err);
                    }
                  } else {
                    toast.success("Added to cart");
                  }
                }}
                className="hover:bg-gray-900 hover:text-white transition-colors"
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
