'use client'; // Essential for client-side hooks and Redux

import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Product } from '@/types/product';
import { Box, Container, Heading, Text } from '@radix-ui/themes';
import ProductDetailsSkeleton from '@/components/products/ProductDetailsSkeleton';
import Image from 'next/image';
import { addToCart } from '@/store/slices/cartSlice';
import { Image as ImageIcon } from 'lucide-react';

import { useEffect } from 'react';
import { fetchProducts } from '@/store/slices/productSlice';
import { AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';

const ProductPage = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.id;
  const productId = Array.isArray(id) ? id[0] : id;

  const { products, loading } = useSelector((state: RootState) => state.products);

  // Get product from Redux store - Use loose comparison or string conversion to be safe
  const product = products.find((p: Product) => String(p.id) === String(productId));

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = () => {
    if (product) {
      console.log(product);
      dispatch(addToCart(product));
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <Container className="product-page p-4 text-center">
        <Heading as="h1" size="4" className="font-bold line-clamp-1">
          Product not found
        </Heading>
        <Text as="p" size="2" color="gray">
          The product you are looking for does not exist.
        </Text>
      </Container>
    );
  }

  return (
    <Container className="product-page p-4">
      <Box className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-6">
        {product.image ? (
          <Image
            width={400}
            height={300}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="text-gray-300" size={96} />
        )}
      </Box>
      <div className='mb-4'>
        <Heading as="h1" size="4" className="font-bold line-clamp-1">
          {product.name}
        </Heading>
        <Text as="p" size="2" color="gray">
          {product.description}
        </Text>
      </div>
      <div className="sticky bottom-12 flex justify-center">
        <Button
          onClick={handleAddToCart}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors max-w-md w-full"
        >
          Add to Cart
        </Button>
      </div>
    </Container>
  );
};

export default ProductPage;
